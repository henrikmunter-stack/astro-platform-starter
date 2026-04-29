import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brukervilkår",
  description: "Les HjemTrygges brukervilkår og avtalevilkår for bruk av tjenesten. Gjeldende for alle abonnementer.",
  openGraph: {
    title: "Brukervilkår | HjemTrygg",
    description: "Les HjemTrygges brukervilkår og avtalevilkår for bruk av tjenesten.",
    url: "https://hjemtrygg.no/vilkar",
    siteName: "HjemTrygg",
    type: "website",
  },
};

export default function VilkarPage() {
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-[#1C2833] mb-2">Brukervilkar</h1>
        <p className="text-[#5d6b7a] mb-8">Sist oppdatert: 1. januar 2024</p>

        <div className="space-y-6">
          {[
            {
              title: "1. Definisjoner",
              content: `"Tjenesten" refererer til HjemTrygg-plattformen tilgjengelig via hjemtrygg.no. "Bruker" eller "du" betyr enhver person som oppretter en konto og benytter tjenesten. "HjemTrygg" eller "vi" refererer til HjemTrygg AS, org.nr. 933 219 569, driftet av Münter Rådgivning, org.nr. 933 219 569.`
            },
            {
              title: "2. Tjenestebeskrivelse",
              content: `HjemTrygg er en digital beredskapsportal for privatpersoner og familier. Tjenesten inkluderer verktøy for sjekklister, lagerbeholdning, familieplanlegging, dokumentlagring og en AI-drevet beredskapsassistent (TryggBot). Tjenesten er ikke et substitut for offisiell beredskapsinformasjon fra myndighetene.`
            },
            {
              title: "3. Registrering og konto",
              content: `Du må være 18 år eller eldre for å opprette konto. Du er ansvarlig for å holde innloggingsinformasjon hemmelig og for all aktivitet som skjer via din konto. Kontakt oss umiddelbart ved mistanke om uautorisert bruk.`
            },
            {
              title: "4. Betalingsbetingelser",
              content: `Betalte abonnementer faktureres månedlig eller årlig via Stripe. Betaling skjer forskuddsvis. Ved manglende betaling vil kontoen automatisk nedgraderes til Demo-planen. Refusjon gis ikke for påbegynte faktureringsperioder, med unntak av tilfeller der vi har begått vesentlig mislighold av avtalen.`
            },
            {
              title: "5. Oppsigelse",
              content: `Du kan si opp abonnementet ditt til enhver tid via Stripe Customer Portal (tilgjengelig fra app/abonnement). Oppsigelsen trer i kraft ved slutten av gjeldende faktureringsperiode. Kontodata beholdes i 90 dager etter oppsigelse, deretter slettes de permanent.`
            },
            {
              title: "6. Ansvarsbegrensning",
              content: `HjemTrygg AS er ikke ansvarlig for tap eller skade som oppstår som følge av manglende beredskap, feil i TryggBot-rådgivning, eller tekniske avbrudd i tjenesten. Tjenesten leveres "som den er", og vi garanterer ikke 100% oppetid. Vi er ikke ansvarlige for indirekte tap, tapt fortjeneste eller konsekvenstap.`
            },
            {
              title: "7. Immaterielle rettigheter",
              content: `All programvare, design, tekst og annet innhold på HjemTrygg-plattformen tilhører HjemTrygg AS eller våre lisensgivere. Du gis en begrenset, ikke-eksklusiv lisens til å bruke tjenesten for personlige, ikke-kommersielle formål.`
            },
            {
              title: "8. Tvisteløsning",
              content: `Denne avtalen er underlagt norsk rett. Eventuelle tvister søkes løst i minnelighet. Dersom dette ikke lykkes, er Oslo tingrett verneting. Forbruker har alltid rett til å bringe saken inn for Forbrukerklageutvalget.`
            },
          ].map((section, i) => (
            <div key={i} className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6">
              <h2 className="text-lg font-semibold text-[#1C2833] mb-3">{section.title}</h2>
              <p className="text-[#5d6b7a] text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
