import {
  ClipboardList,
  Package,
  Users,
  FileText,
  Bot,
  Download,
} from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Digitale sjekklister",
    description:
      "Basert på DSBs offisielle anbefalinger. Hak av item for item og se fremgangen din i sanntid.",
  },
  {
    icon: Package,
    title: "Lageroversikt",
    description:
      "Hold oversikt over mat, vann, medisiner og utstyr. Varsler ved utløpsdatoer.",
  },
  {
    icon: Users,
    title: "Familieplan",
    description:
      "Legg inn familiekontakter, roller og møtepunkter. Hele familien vet hva som gjelder.",
  },
  {
    icon: FileText,
    title: "Dokumentlagring",
    description:
      "Lagre pass, forsikringsdokumenter og andre viktige papirer trygt og tilgjengelig.",
  },
  {
    icon: Bot,
    title: "TryggBot – AI-assistent",
    description:
      "Din personlige beredskapsrådgiver. Still spørsmål og få konkrete svar basert på din situasjon.",
  },
  {
    icon: Download,
    title: "Eksport til PDF",
    description:
      "Last ned hele beredskapsplanen din som PDF. Alltid tilgjengelig, selv uten internett.",
  },
];

export function Features() {
  return (
    <section className="py-16 bg-[#F4F6F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-[#1C2833] mb-3">Alt du trenger for god beredskap</h2>
          <p className="text-[#5d6b7a] max-w-xl mx-auto">
            HjemTrygg samler alt i ett verktøy, slik at du slipper å holde styr på spredte lister og dokumenter.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="bg-white rounded-lg border border-[#e5e9ec] p-6 shadow-sm">
                <div className="w-11 h-11 rounded-md bg-[#1B4F72]/10 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[#1B4F72]" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-[#1C2833] mb-2">{feature.title}</h3>
                <p className="text-[#5d6b7a] text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
