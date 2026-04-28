import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om HjemTrygg",
  description: "Lær mer om HjemTrygg, teamet bak og vår misjon for norsk hjemmeberedskap.",
};

export default function OmPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-[#1C2833] mb-6">Om HjemTrygg</h1>

        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-[#1C2833] mb-4">Vår historie</h2>
          <p className="text-[#5d6b7a] leading-relaxed mb-4">
            HjemTrygg ble grunnlagt i 2023 i Oslo, med ett klart mål: å gjøre god hjemmeberedskap
            tilgjengelig for alle norske familier. Vi så at beredskapsarbeid var fragmentert,
            tungvint og utilgjengelig – spredt over ulike nettsider, utskrifter og sticky notes.
          </p>
          <p className="text-[#5d6b7a] leading-relaxed mb-4">
            Med bakgrunn fra offentlig beredskapsarbeid og digital produktutvikling, satte vi oss ned
            for å bygge det verktøyet vi selv hadde savnet. Resultatet er HjemTrygg – en komplett,
            norsk beredskapsportal som samler alt på ett sted.
          </p>
          <p className="text-[#5d6b7a] leading-relaxed">
            I dag bruker tusenvis av norske familier HjemTrygg til å planlegge, logge og oppdatere
            sin hjemmeberedskap. Vi er stolt av tilliten som er gitt oss, og vi tar ansvar for
            å forvalte persensitive data med den høyeste grad av sikkerhet.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-[#1C2833] mb-6">Teamet</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Maren Holm", role: "Daglig leder og grunnlegger", description: "Tidligere beredskapskonsulent i DSB. Brenner for at alle nordmenn skal ha en god plan." },
              { name: "Kristoffer Nygaard", role: "Teknisk leder", description: "15 år med fullstack-utvikling. Ansvarlig for sikkerhet, infrastruktur og API-design." },
              { name: "Sigrid Berg", role: "Produktdesigner", description: "Designer brukeropplevelser som gjør kompleks informasjon enkel og tilgjengelig." },
            ].map((person, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-lg bg-[#1B4F72]/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-semibold text-[#1B4F72]">
                    {person.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <h3 className="font-semibold text-[#1C2833]">{person.name}</h3>
                <p className="text-[#2E86AB] text-sm mb-2">{person.role}</p>
                <p className="text-[#5d6b7a] text-sm">{person.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-[#1C2833] mb-4">Misjon og verdier</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Tilgjengelighet", desc: "Beredskapsplanlegging skal ikke kreve teknisk kunnskap eller dyp faglig bakgrunn. Vi bygger for alle." },
              { title: "Personvern", desc: "Dataene dine er dine. Vi selger aldri data til tredjeparter og gir deg full kontroll." },
              { title: "Pålitelighet", desc: "Vi bygger for å vare. Systemer som fungerer når det gjelder – også i en krisesituasjon." },
              { title: "Norsk kontekst", desc: "Vi er bygget for norske forhold: DSBs anbefalinger, norske risikoscenarier og norsk lovgivning." },
            ].map((value, i) => (
              <div key={i} className="bg-[#F4F6F7] rounded-lg p-4">
                <h3 className="font-semibold text-[#1C2833] mb-2">{value.title}</h3>
                <p className="text-[#5d6b7a] text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
