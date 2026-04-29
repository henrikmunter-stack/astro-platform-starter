import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1C2833] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="mb-4">
              <span className="text-xl font-semibold text-white">HjemTrygg</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Den digitale beredskapsportalen for norske familier. Vi hjelper deg med
              å planlegge, forberede og holde oversikt over familiens beredskap.
            </p>
            <p className="text-gray-500 text-xs mt-4">
              HjemTrygg AS, org.nr. 933 219 569
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Driftet av Münter Rådgivning, org.nr. 933 219 569
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Tjeneste
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/priser", label: "Priser" },
                { href: "/planer", label: "Planer" },
                { href: "/blogg", label: "Blogg" },
                { href: "/om", label: "Om oss" },
                { href: "/kontakt", label: "Kontakt" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Juridisk
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/personvern", label: "Personvern" },
                { href: "/vilkar", label: "Brukervilkar" },
                { href: "/sikkerhet", label: "Sikkerhet" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} HjemTrygg AS. Alle rettigheter forbeholdt.
          </p>
          <p className="text-gray-500 text-sm">
            Bygget med hensyn til norsk beredskap og personvern.
          </p>
        </div>
      </div>
    </footer>
  );
}
