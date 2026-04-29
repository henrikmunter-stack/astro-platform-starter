import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om HjemTrygg",
  description: "HjemTrygg er laget for helt vanlige familier som ønsker mer trygghet i hverdagen.",
};

export default function OmPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-[#1C2833] mb-6">Om HjemTrygg</h1>

        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-8 mb-8">
          <p className="text-[#5d6b7a] leading-relaxed mb-4">
            HjemTrygg er laget for helt vanlige familier som ønsker mer trygghet i hverdagen.
          </p>
          <p className="text-[#5d6b7a] leading-relaxed mb-4">
            Bak HjemTrygg står Henrik Münter. Jeg har bakgrunn fra flere år i Forsvaret, mange år i hotellbransjen
            og jobber i dag med cybersikkerhet. Fellesnevneren er beredskap – enten det handler om mennesker,
            systemer eller uforutsette hendelser.
          </p>
          <p className="text-[#5d6b7a] leading-relaxed mb-4">
            Tiden i hotellbransjen lærte meg noe viktig: Du må alltid være forberedt på det du ikke kan planlegge.
            Når noe først skjer, er det for sent å begynne å tenke.
          </p>
          <p className="text-[#5d6b7a] leading-relaxed mb-4">
            Som familiefar, med mye tid på sjøen og på fjellet, har jeg også erfart hvor fort situasjoner kan endre
            seg. Strømmen kan forsvinne. Været kan snu. Ting fungerer plutselig ikke som de skal.
          </p>
          <p className="text-[#5d6b7a] leading-relaxed mb-4 font-medium text-[#1C2833]">
            Det er nettopp derfor HjemTrygg finnes.
          </p>
          <p className="text-[#5d6b7a] leading-relaxed mb-4">
            Direktoratet for samfunnssikkerhet og beredskap (DSB) anbefaler at norske husholdninger skal kunne klare
            seg selv i flere dager ved kriser. Likevel er det mange som ikke vet hvor de skal begynne.
          </p>
          <p className="text-[#5d6b7a] leading-relaxed mb-4">
            HjemTrygg gjør beredskap enkelt, konkret og gjennomførbart.
          </p>
          <p className="text-[#5d6b7a] leading-relaxed mb-4">
            Her finner du sjekklister, planer og råd som er tilpasset norske hjem, familier og hverdagsliv. Ikke
            ekstremt. Ikke komplisert. Bare det som faktisk er nødvendig.
          </p>
          <p className="text-[#5d6b7a] leading-relaxed mb-4">
            Målet er ikke å skape frykt. Målet er å gi ro.
          </p>
          <p className="text-[#5d6b7a] leading-relaxed">
            Når du vet hva du har, hva du mangler og hva du skal gjøre hvis noe skjer, blir hverdagen litt tryggere.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-[#1C2833] mb-6">Tre enkle prinsipper</h2>
          <div className="space-y-4">
            {[
              { title: "Enkelt", desc: "Lett å forstå, uten faguttrykk." },
              { title: "Praktisk", desc: "Tiltak du faktisk får gjennomført." },
              { title: "Trygt", desc: "Tilpasset norske forhold og vanlige familier." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-[#F4F6F7] rounded-lg p-4">
                <div className="w-8 h-8 rounded-md bg-[#1B4F72]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-[#1B4F72]">{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1C2833] mb-1">{item.title}</h3>
                  <p className="text-[#5d6b7a] text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[#5d6b7a] leading-relaxed mt-6">
            HjemTrygg er for deg som vil være forberedt uten å overdrive. For deg som ønsker kontroll, uten å gjøre
            det komplisert.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-[#1C2833] mb-6">Verdier</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Ærlighet fremfor markedsføring",
                desc: "Vi sier ikke at du er trygg — vi hjelper deg å bli det.",
              },
              {
                title: "Norsk kontekst",
                desc: "Bygget rundt DSBs anbefalinger og norske risikoscenarier, ikke generiske internasjonale maler.",
              },
              {
                title: "Personvern som standard",
                desc: "Dataene dine er dine. Vi selger aldri informasjon til tredjeparter og gir deg full kontroll til enhver tid.",
              },
              {
                title: "Enkelhet",
                desc: "God beredskap skal ikke kreve ekspertkunnskap. Det skal være gjørbart for alle — uansett livssituasjon.",
              },
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
