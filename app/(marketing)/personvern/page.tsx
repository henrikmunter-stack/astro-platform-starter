import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personvernerklæring",
  description: "Les HjemTrygges personvernerklæring og finn ut hvordan vi håndterer dine data i tråd med GDPR.",
  openGraph: {
    title: "Personvernerklæring | HjemTrygg",
    description: "Les HjemTrygges personvernerklæring og finn ut hvordan vi håndterer dine data i tråd med GDPR.",
    url: "https://hjemtrygg.no/personvern",
    siteName: "HjemTrygg",
    type: "website",
  },
};

export default function PersonvernPage() {
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-[#1C2833] mb-2">Personvernerklæring</h1>
        <p className="text-[#5d6b7a] mb-8">Sist oppdatert: 1. januar 2024</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#1C2833] mb-3">1. Behandlingsansvarlig</h2>
            <p className="text-[#5d6b7a] text-sm leading-relaxed">
              HjemTrygg AS, org.nr. 933 219 569 (driftet av Münter Rådgivning, org.nr. 933 219 569), Sagesundveien 133, 4904 Tvedestrand, er behandlingsansvarlig for
              personopplysninger som behandles i forbindelse med bruk av tjenesten HjemTrygg.
              Kontakt: personvern@hjemtrygg.no
            </p>
          </section>

          <section className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#1C2833] mb-3">2. Hvilke data samler vi inn?</h2>
            <p className="text-[#5d6b7a] text-sm leading-relaxed mb-3">Vi samler inn og behandler følgende kategorier av personopplysninger:</p>
            <ul className="space-y-2 text-sm text-[#5d6b7a]">
              <li><strong className="text-[#1C2833]">Kontaktinformasjon:</strong> E-postadresse, navn (valgfritt)</li>
              <li><strong className="text-[#1C2833]">Kontodata:</strong> Innloggingstidspunkt, siste aktivitet, abonnementstype</li>
              <li><strong className="text-[#1C2833]">Beredskapsdata:</strong> Sjekklister, lagerbeholdning, familiekontakter, møtepunkter, dokumentmetadata, TryggBot-samtaler</li>
              <li><strong className="text-[#1C2833]">Betalingsdata:</strong> Stripe-kundeID og abonnementsID (kortdetaljer lagres aldri hos oss)</li>
              <li><strong className="text-[#1C2833]">Tekniske data:</strong> IP-adresse, nettleserinformasjon, logg for feilsøking</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#1C2833] mb-3">3. Grunnlag for behandlingen</h2>
            <p className="text-[#5d6b7a] text-sm leading-relaxed">
              Behandlingen er nødvendig for å oppfylle avtalen med deg (GDPR art. 6 b), for å
              overholde rettslige forpliktelser (art. 6 c), samt basert på berettigede interesser
              i form av drifts- og sikkerhetslogger (art. 6 f). For TryggBot-samtaler behandler
              vi data basert på ditt samtykke ved registrering.
            </p>
          </section>

          <section className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#1C2833] mb-3">4. Hvem har tilgang til data?</h2>
            <p className="text-[#5d6b7a] text-sm leading-relaxed mb-3">
              Vi deler ikke dine personopplysninger med tredjeparter for markedsføring eller
              kommersielle formål. Data deles kun med nødvendige underleverandører:
            </p>
            <ul className="space-y-1 text-sm text-[#5d6b7a]">
              <li><strong className="text-[#1C2833]">Vercel:</strong> Hosting og serverinfrastruktur (USA, EU Standard Contractual Clauses)</li>
              <li><strong className="text-[#1C2833]">Supabase/Neon:</strong> Databaselagring (EU)</li>
              <li><strong className="text-[#1C2833]">Stripe:</strong> Betalingsbehandling (EU, PCI-DSS sertifisert)</li>
              <li><strong className="text-[#1C2833]">OpenAI:</strong> TryggBot-meldinger behandles av OpenAI (USA, personverngarantier på plass)</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#1C2833] mb-3">5. Lagringstid</h2>
            <p className="text-[#5d6b7a] text-sm leading-relaxed">
              Kontodata og beredskapsdata lagres så lenge kontoen er aktiv. Ved oppsigelse
              slettes data innen 90 dager, med unntak av det som er nødvendig for regnskapsmessige
              og rettslige formål (opptil 5 år). Chat-historikk kan slettes manuelt av brukeren når som helst.
            </p>
          </section>

          <section className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#1C2833] mb-3">6. Dine rettigheter</h2>
            <p className="text-[#5d6b7a] text-sm leading-relaxed mb-3">Du har følgende rettigheter under GDPR:</p>
            <ul className="space-y-2 text-sm text-[#5d6b7a]">
              <li><strong className="text-[#1C2833]">Innsyn:</strong> Du kan be om en kopi av alle personopplysninger vi har om deg</li>
              <li><strong className="text-[#1C2833]">Retting:</strong> Du kan korrigere feilaktige opplysninger</li>
              <li><strong className="text-[#1C2833]">Sletting:</strong> Du kan be om sletting av dine data (&quot;retten til å bli glemt&quot;)</li>
              <li><strong className="text-[#1C2833]">Dataportabilitet:</strong> Du kan laste ned alle dine data i maskinlesbart format (JSON) fra innstillinger</li>
              <li><strong className="text-[#1C2833]">Innsigelse:</strong> Du kan protestere mot behandling basert på berettigede interesser</li>
              <li><strong className="text-[#1C2833]">Klage:</strong> Du kan klage til Datatilsynet (datatilsynet.no)</li>
            </ul>
            <p className="text-[#5d6b7a] text-sm mt-3">
              For å utøve dine rettigheter, send e-post til{" "}
              <a href="mailto:personvern@hjemtrygg.no" className="text-[#2E86AB] hover:underline">
                personvern@hjemtrygg.no
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
