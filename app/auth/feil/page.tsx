import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export default function AuthFeilPage() {
  return (
    <div className="min-h-screen bg-[#F4F6F7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <Logo size="lg" className="justify-center mb-6" />
        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-8">
          <h1 className="text-xl font-semibold text-[#C0392B] mb-2">Innloggingsfeil</h1>
          <p className="text-[#5d6b7a] text-sm mb-4">
            Det oppsto en feil under innloggingen. Prøv igjen eller kontakt support.
          </p>
          <Link
            href="/logg-inn"
            className="inline-block bg-[#1B4F72] text-white font-semibold px-5 py-2.5 rounded-md hover:bg-[#16405e] transition-colors"
          >
            Prøv igjen
          </Link>
        </div>
      </div>
    </div>
  );
}
