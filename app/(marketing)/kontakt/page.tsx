import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { KontaktForm } from "@/components/marketing/KontaktForm";

export const metadata: Metadata = {
  title: "Kontakt oss",
  description: "Ta kontakt med HjemTrygg. Vi svarer på alle henvendelser innen én virkedag. Teknisk support, fakturering og generelle spørsmål.",
  openGraph: {
    title: "Kontakt oss | HjemTrygg",
    description: "Ta kontakt med HjemTrygg. Vi svarer på alle henvendelser innen én virkedag.",
    url: "https://hjemtrygg.no/kontakt",
    siteName: "HjemTrygg",
    type: "website",
  },
};

export default function KontaktPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-[#1C2833] mb-4">Kontakt oss</h1>
        <p className="text-[#5d6b7a] text-lg mb-10">
          Har du spørsmål, tilbakemeldinger eller trenger hjelp? Vi svarer på alle henvendelser innen én virkedag.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-8">
              <h2 className="text-xl font-semibold text-[#1C2833] mb-6">Send oss en melding</h2>
              <KontaktForm />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-[#1B4F72] mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-[#1C2833] text-sm">E-post</p>
                  <a href="mailto:hei@hjemtrygg.no" className="text-[#2E86AB] text-sm hover:underline">
                    hei@hjemtrygg.no
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#1B4F72] mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-[#1C2833] text-sm">Adresse</p>
                  <p className="text-[#5d6b7a] text-sm">
                    Sagesundveien 133<br />
                    4904 Tvedestrand
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#F4F6F7] rounded-lg border border-[#e5e9ec] p-6">
              <p className="font-medium text-[#1C2833] text-sm mb-1">Responstid</p>
              <p className="text-[#5d6b7a] text-sm">
                Vi svarer normalt innen 1 virkedag. Premium-kunder har prioritert support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
