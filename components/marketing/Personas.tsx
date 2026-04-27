import { Home, Heart, TreePine } from "lucide-react";

const personas = [
  {
    icon: Home,
    title: "Barnefamilier",
    description:
      "Planlegg for hele familien. Involver barna i beredskapen på en trygg måte og sørg for at alle vet hva de skal gjøre.",
  },
  {
    icon: Heart,
    title: "Eldre hjemmeboende",
    description:
      "Enkelt grensesnitt med tydelig oversikt. Legg inn kontakter og pårørende som kan hjelpe ved behov.",
  },
  {
    icon: TreePine,
    title: "Hyttefolk",
    description:
      "Separat beredskapsplan for hytta. Tilpass lageroversikten til hyttens behov og særegne risikoscenarier.",
  },
];

export function Personas() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-[#1C2833] mb-3">For alle typer husstander</h2>
          <p className="text-[#5d6b7a] max-w-xl mx-auto">
            HjemTrygg er tilpasset norske familiers ulike livssituasjoner og behov.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personas.map((persona, i) => {
            const Icon = persona.icon;
            return (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-lg bg-[#A8DADC]/30 flex items-center justify-center mx-auto mb-4">
                  <Icon size={28} className="text-[#1B4F72]" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-[#1C2833] mb-2">{persona.title}</h3>
                <p className="text-[#5d6b7a] text-sm leading-relaxed">{persona.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
