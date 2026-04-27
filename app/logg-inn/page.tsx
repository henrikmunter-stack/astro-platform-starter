"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/shared/Logo";
import { Loader2 } from "lucide-react";

export default function LoggInnPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("nodemailer", { email, redirect: false, callbackUrl: "/app" });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-3" />
          <p className="text-[#5d6b7a] text-sm">Logg inn på HjemTrygg</p>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-[#1E8449]/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#1E8449]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-semibold text-[#1C2833] mb-1">Sjekk e-posten din</h2>
              <p className="text-[#5d6b7a] text-sm">
                Vi har sendt en innloggingslenke til <strong>{email}</strong>
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-[#1C2833] mb-1">Logg inn</h1>
              <p className="text-[#5d6b7a] text-sm mb-5">Vi sender deg en sikker innloggingslenke.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#1C2833] mb-1">
                    E-postadresse
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                    placeholder="din@epost.no"
                    autoComplete="email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 bg-[#1B4F72] text-white font-semibold py-2.5 rounded-md hover:bg-[#16405e] disabled:opacity-50 transition-colors"
                >
                  {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
                  Send innloggingslenke
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-[#5d6b7a] mt-4">
          Ny bruker? Logg inn for å opprette konto automatisk.
        </p>
      </div>
    </div>
  );
}
