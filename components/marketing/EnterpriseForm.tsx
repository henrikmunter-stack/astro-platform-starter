"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

export function EnterpriseForm() {
  const [navn, setNavn] = useState("");
  const [epost, setEpost] = useState("");
  const [org, setOrg] = useState("");
  const [melding, setMelding] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feilmelding, setFeilmelding] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setFeilmelding("");

    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          navn,
          epost,
          emne: `Bedrift/kommune-tilbud – ${org}`,
          melding,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeilmelding(data.error ?? "Noe gikk galt. Prøv igjen.");
        setStatus("error");
      } else {
        setStatus("success");
        setNavn("");
        setEpost("");
        setOrg("");
        setMelding("");
      }
    } catch {
      setFeilmelding("Noe gikk galt. Prøv igjen eller send e-post til hei@hjemtrygg.no.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center py-8 gap-4">
        <CheckCircle size={48} className="text-[#1E8449]" aria-hidden="true" />
        <div>
          <p className="font-semibold text-[#1C2833] text-lg">Forespørselen er sendt!</p>
          <p className="text-[#5d6b7a] text-sm mt-1">Vi tar kontakt innen 1–2 virkedager.</p>
        </div>
        <button onClick={() => setStatus("idle")} className="text-sm text-[#2E86AB] hover:underline">
          Send en ny forespørsel
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="org-name" className="block text-sm font-medium text-[#1C2833] mb-1">Navn</label>
          <input
            id="org-name"
            type="text"
            required
            value={navn}
            onChange={(e) => setNavn(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            placeholder="Ditt navn"
          />
        </div>
        <div>
          <label htmlFor="org-email" className="block text-sm font-medium text-[#1C2833] mb-1">E-post</label>
          <input
            id="org-email"
            type="email"
            required
            value={epost}
            onChange={(e) => setEpost(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            placeholder="din@organisasjon.no"
          />
        </div>
      </div>
      <div>
        <label htmlFor="org-company" className="block text-sm font-medium text-[#1C2833] mb-1">Organisasjon</label>
        <input
          id="org-company"
          type="text"
          required
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
          placeholder="Navn på bedrift eller kommune"
        />
      </div>
      <div>
        <label htmlFor="org-message" className="block text-sm font-medium text-[#1C2833] mb-1">Melding</label>
        <textarea
          id="org-message"
          rows={3}
          required
          value={melding}
          onChange={(e) => setMelding(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
          placeholder="Beskriv hva dere er ute etter..."
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-[#C0392B] bg-[#C0392B]/10 rounded-md px-4 py-2">{feilmelding}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-[#1B4F72] text-white font-semibold px-6 py-2.5 rounded-md hover:bg-[#16405e] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B4F72] disabled:opacity-60"
      >
        {status === "loading" ? "Sender..." : "Send forespørsel"}
      </button>
    </form>
  );
}
