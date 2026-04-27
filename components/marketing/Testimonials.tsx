const testimonials = [
  {
    quote:
      "Vi hadde aldri tenkt skikkelig gjennom hva vi trenger ved en strøm- eller vannkrise. HjemTrygg fikk oss til å faktisk gjøre noe med det. Anbefaler til alle barnefamilier.",
    name: "Anne Kristin Dahl",
    location: "Bergen",
  },
  {
    quote:
      "TryggBot svarte på alle mine spørsmål om vannlagring og utløpsdatoer. Det er som å ha en beredskapsekspert tilgjengelig døgnet rundt.",
    name: "Reidar Sørum",
    location: "Trondheim",
  },
  {
    quote:
      "Endelig et norsk verktøy som tar beredskap på alvor. Jeg har lastet ned planen vår som PDF og den ligger i beredskapsesken sammen med resten.",
    name: "Ingrid Marie Lund",
    location: "Oslo",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-[#F4F6F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-[#1C2833] mb-3">
            Hva sier brukerne våre?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <blockquote
              key={i}
              className="bg-white rounded-lg border border-[#e5e9ec] p-6 shadow-sm"
            >
              <div className="text-[#2E86AB] text-3xl font-serif mb-3" aria-hidden="true">"</div>
              <p className="text-[#1C2833] text-sm leading-relaxed mb-4">{t.quote}</p>
              <footer>
                <cite className="not-italic">
                  <span className="font-semibold text-[#1C2833] text-sm">{t.name}</span>
                  <span className="text-[#5d6b7a] text-xs ml-2">{t.location}</span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
