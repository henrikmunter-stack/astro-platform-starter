import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export default function SjekkEpostPage() {
  return (
    <div className="min-h-screen bg-[#F4F6F7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <Logo size="lg" className="justify-center mb-6" />
        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-8">
          <div className="w-12 h-12 rounded-lg bg-[#1E8449]/10 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-[#1E8449]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#1C2833] mb-2">Sjekk e-posten din</h1>
          <p className="text-[#5d6b7a] text-sm">
            En innloggingslenke er sendt. Klikk på lenken i e-posten for å logge inn.
          </p>
        </div>
        <Link href="/logg-inn" className="mt-4 inline-block text-sm text-[#2E86AB] hover:underline">
          Tilbake til innlogging
        </Link>
      </div>
    </div>
  );
}
