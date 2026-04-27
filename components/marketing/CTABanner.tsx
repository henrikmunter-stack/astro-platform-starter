import Link from "next/link";

export function CTABanner() {
  return (
    <section className="bg-[#1B4F72] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-semibold text-white mb-4">
          Klar til å komme i gang?
        </h2>
        <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
          Registrer deg gratis i dag og ta det første steget mot en tryggere hverdag for hele familien.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/api/auth/signin"
            className="inline-flex items-center justify-center bg-white text-[#1B4F72] font-semibold px-8 py-3 rounded-md hover:bg-blue-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Prøv gratis
          </Link>
          <Link
            href="/priser"
            className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-8 py-3 rounded-md hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Se alle planer
          </Link>
        </div>
      </div>
    </section>
  );
}
