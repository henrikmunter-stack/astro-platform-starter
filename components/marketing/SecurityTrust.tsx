import Link from "next/link";
import { Lock, ShieldCheck, Eye } from "lucide-react";

export function SecurityTrust() {
  return (
    <section className="py-12 bg-[#F4F6F7] border-t border-[#e5e9ec]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Lock size={24} className="text-[#1B4F72] mb-2" aria-hidden="true" />
            <h3 className="font-semibold text-[#1C2833] text-sm mb-1">TLS 1.3-kryptering</h3>
            <p className="text-[#5d6b7a] text-xs">All data overføres kryptert.</p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck size={24} className="text-[#1B4F72] mb-2" aria-hidden="true" />
            <h3 className="font-semibold text-[#1C2833] text-sm mb-1">GDPR-kompatibel</h3>
            <p className="text-[#5d6b7a] text-xs">
              Dine data lagres i Europa.{" "}
              <Link href="/personvern" className="underline hover:text-[#1B4F72]">Les mer</Link>
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Eye size={24} className="text-[#1B4F72] mb-2" aria-hidden="true" />
            <h3 className="font-semibold text-[#1C2833] text-sm mb-1">Full datatransparens</h3>
            <p className="text-[#5d6b7a] text-xs">
              Eksportér eller slett alt når som helst.{" "}
              <Link href="/sikkerhet" className="underline hover:text-[#1B4F72]">Les mer</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
