import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative text-white py-20 md:py-28 overflow-hidden">
      <Image
        src="/images/hero-family.jpg"
        alt="Norsk familie forbereder seg på beredskap hjemme"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-[#1B4F72]/75" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <ShieldCheck size={16} aria-hidden="true" />
            Anbefalt av beredskapseksperter
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
            HjemTrygg – beredskap gjort enkelt
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            Den digitale beredskapsportalen som hjelper norske familier å være forberedt.
            Sjekklister, lageroversikt, familieplan og en smart beredskapsassistent – alt på ett sted.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/priser"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1B4F72] font-semibold px-8 py-3 rounded-md hover:bg-blue-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Se abonnement
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/api/auth/signin"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-8 py-3 rounded-md hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Prøv demo gratis
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
