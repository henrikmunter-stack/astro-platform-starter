import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontakt oss",
  description: "Ta kontakt med HjemTrygg. Vi svarer på alle henvendelser innen én virkedag.",
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
              <form className="space-y-5" action="#" method="POST">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#1C2833] mb-1">
                      Navn <span className="text-[#C0392B]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      required
                      className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                      placeholder="Ditt fulle navn"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#1C2833] mb-1">
                      E-post <span className="text-[#C0392B]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                      placeholder="din@epost.no"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#1C2833] mb-1">
                    Emne <span className="text-[#C0392B]">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72] bg-white"
                  >
                    <option value="">Velg emne...</option>
                    <option value="support">Teknisk support</option>
                    <option value="billing">Fakturering og abonnement</option>
                    <option value="feature">Funksjonsønske</option>
                    <option value="privacy">Personvern og data</option>
                    <option value="enterprise">Bedrift/kommune-tilbud</option>
                    <option value="other">Annet</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#1C2833] mb-1">
                    Melding <span className="text-[#C0392B]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-3 py-2 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                    placeholder="Beskriv henvendelsen din..."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1B4F72] text-white font-semibold px-6 py-2.5 rounded-md hover:bg-[#16405e] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B4F72]"
                >
                  Send melding
                </button>
              </form>
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
                    Storgata 1<br />
                    0155 Oslo
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
