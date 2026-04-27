export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Registrer deg",
      description:
        "Opprett konto på under ett minutt med e-post eller Google. Velg den planen som passer din familie best.",
    },
    {
      number: "02",
      title: "Bygg din plan",
      description:
        "Fyll inn sjekklister, lagerbeholdning og familiekontakter. TryggBot veileder deg gjennom hele prosessen.",
    },
    {
      number: "03",
      title: "Hold deg oppdatert",
      description:
        "Få varsler om utløpsdatoer på lagervarer og oppdater planen din etter hvert som livet endrer seg.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-[#1C2833] mb-3">Slik fungerer det</h2>
          <p className="text-[#5d6b7a] max-w-xl mx-auto">
            Fra registrering til komplett beredskapsplan på under 10 minutter.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-[#e5e9ec] z-0" style={{ width: "calc(100% - 3rem)", left: "calc(50% + 2rem)" }} />
              )}
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-lg bg-[#1B4F72] text-white text-xl font-semibold flex items-center justify-center mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-[#1C2833] mb-2">{step.title}</h3>
                <p className="text-[#5d6b7a] text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
