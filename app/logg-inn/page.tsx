"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/shared/Logo";
import { Mail, Chrome, Loader2, CheckCircle } from "lucide-react";

export default function LoggInnPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    const result = await signIn("nodemailer", {
      email: email.trim(),
      redirect: false,
      callbackUrl: "/app",
    });
    if (result?.error) {
      setError("Noe gikk galt. Sjekk e-postadressen og prøv igjen.");
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/app" });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-3" />
          <p className="text-[#5d6b7a] text-sm">Din digitale beredskapsportal</p>
        </div>

        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-8">
          {sent ? (
            <div className="text-center">
              <CheckCircle size={40} className="text-[#1E8449] mx-auto mb-3" aria-hidden="true" />
              <h2 className="font-semibold text-[#1C2833] mb-2">Sjekk innboksen din</h2>
              <p className="text-[#5d6b7a] text-sm">
                Vi har sendt en innloggingslenke til <strong>{email}</strong>. Lenken er gyldig i 24 timer.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-[#1C2833] mb-6 text-center">Logg inn</h1>

              <form onSubmit={handleEmail} className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-[#1C2833] mb-1.5">
                  E-postadresse
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@epost.no"
                  required
                  className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72] mb-3"
                />
                {error && (
                  <p className="text-xs text-[#C0392B] mb-3">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 h-10 bg-[#1B4F72] text-white text-sm font-semibold rounded-md hover:bg-[#16405e] disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Mail size={16} aria-hidden="true" />
                  )}
                  Send innloggingslenke
                </button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e5e9ec]" />
                </div>
                <div className="relative flex justify-center text-xs text-[#9aabb8] bg-white px-2">
                  eller
                </div>
              </div>

              <button
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-2 h-10 border border-[#e5e9ec] text-[#1C2833] text-sm font-medium rounded-md hover:bg-[#F4F6F7] disabled:opacity-50 transition-colors"
              >
                {googleLoading ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Chrome size={16} aria-hidden="true" />
                )}
                Fortsett med Google
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-[#9aabb8] mt-6">
          Ved å logge inn godtar du våre{" "}
          <a href="/vilkar" className="underline hover:text-[#5d6b7a]">vilkår</a> og{" "}
          <a href="/personvern" className="underline hover:text-[#5d6b7a]">personvernregler</a>.
        </p>
      </div>
    </div>
  );
}
