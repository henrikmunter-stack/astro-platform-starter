import Link from "next/link";

export function Testimonials() {
  return (
    <section className="py-16 bg-[#F4F6F7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-semibold text-[#1C2833] mb-4">
          Tidlig lansering
        </h2>
        <p className="text-[#5d6b7a] leading-relaxed mb-4">
          HjemTrygg er nylig lansert og vi ønsker de første brukerne velkommen.
        </p>
        <p className="text-[#5d6b7a] leading-relaxed mb-4">
          Vi er opptatt av å bygge et verktøy som faktisk fungerer i hverdagen — og tilbakemeldinger
          fra ekte brukere er det viktigste vi kan få akkurat nå.
        </p>
        <p className="text-[#5d6b7a] leading-relaxed mb-8">
          Har du tanker, innspill eller opplever noe som ikke fungerer som det skal? Send oss en
          melding på kontakt-siden — vi leser alt og svarer på det meste.
        </p>
        <Link
          href="/kontakt"
          className="inline-block bg-[#1B4F72] text-white text-sm font-semibold px-6 py-3 rounded-md hover:bg-[#16405e] transition-colors"
        >
          Gi tilbakemelding
        </Link>
      </div>
    </section>
  );
}
