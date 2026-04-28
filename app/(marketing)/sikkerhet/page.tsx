import type { Metadata } from "next";
import { Lock, Server, Eye, Trash2, Users, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Sikkerhet",
  description: "Les om HjemTrygges sikkerhetsarkitektur, kryptering og rutiner.",
};

export default function SikkerhetPage() {
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-[#1C2833] mb-4">Sikkerhet</h1>
        <p className="text-[#5d6b7a] text-lg mb-10">
          Vi tar sikkerheten til dine beredskapsdata svært alvorlig. Her er en oversikt
          over våre tekniske tiltak og rutiner.
        </p>

        <div className="space-y-6">
          {[
            {
              Icon: Lock,
              title: "Kryptering i overføring og lagring",
              content: "All kommunikasjon mellom din nettleser og våre servere er kryptert med TLS 1.3. Data i databasen krypteres med AES-256. Passord lagres aldri i klartekst – vi bruker magic links og OAuth for autentisering.",
            },
            {
              Icon: Server,
              title: "Infrastruktur og tilgangskontroll",
              content: "Tjenesten kjører på Vercel med europeisk dataruting. Databasen hostes på Supabase eller Neon i EU. Tilgang til produksjonssystemer er begrenset til autoriserte utviklere med MFA og revisjonssporing.",
            },
            {
              Icon: Eye,
              title: "Logging og overvåkning",
              content: "Vi fører revisjonlogger (audit logs) over alle kritiske operasjoner: innlogging, betalingstransaksjoner, dataeksport og kontosletting. Logger lagres i 180 dager.",
            },
            {
              Icon: Trash2,
              title: "Sletterutiner",
              content: "Ved kontooppsigelse gjennomfører vi soft delete umiddelbart og permanent sletting innen 90 dager. Du kan be om umiddelbar permanent sletting ved å kontakte oss. Stripe-data slettes i henhold til Stripes retningslinjer.",
            },
            {
              Icon: Users,
              title: "Underleverandører",
              content: "Vi bruker Stripe (PCI DSS Level 1) for betalinger, OpenAI for TryggBot-meldinger (med begrenset datadeling), og Vercel/Supabase for infrastruktur. Alle underleverandører er bundet av databehandleravtaler.",
            },
            {
              Icon: AlertTriangle,
              title: "Håndtering av sikkerhetshendelser",
              content: "Ved mistanke om brudd på datasikkerhet varsler vi berørte brukere og Datatilsynet innen 72 timer, i tråd med GDPR. Kontakt sikkerhet@hjemtrygg.no for å rapportere sårbarhet (responsible disclosure).",
            },
          ].map(({ Icon, title, content }, i) => (
            <div key={i} className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6 flex gap-4">
              <div className="w-10 h-10 rounded-md bg-[#1B4F72]/10 flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-[#1B4F72]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#1C2833] mb-2">{title}</h2>
                <p className="text-[#5d6b7a] text-sm leading-relaxed">{content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-[#F4F6F7] rounded-lg border border-[#e5e9ec] p-6">
          <h2 className="font-semibold text-[#1C2833] mb-2">Kontaktpunkt for sikkerhetshenvendelser</h2>
          <p className="text-[#5d6b7a] text-sm">
            Oppdaget du en sårbarhet? Vi setter pris på ansvarlig varsling.{" "}
            <a href="mailto:sikkerhet@hjemtrygg.no" className="text-[#2E86AB] hover:underline">
              sikkerhet@hjemtrygg.no
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
