"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

export function KontaktForm() {
  const [navn, setNavn] = useState("");
  const [epost, setEpost] = useState("");
  const [emne, setEmne] = useState("");
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
        body: JSON.stringify({ navn, epost, emne, melding }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeilmelding(data.error ?? "Noe gikk galt. Prøv igjen.");
        setStatus("error");
      } else {
        setStatus("success");
        setNavn("");
        setEpost("");
        setEmne("");
        setMelding("");
      }
    } catch {
      setFeilmelding("Noe gikk galt. Prøv igjen eller send e-post direkte til hei@hjemtrygg.no.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center py-8 gap-4">
        <CheckCircle size={48} className="text-[#1E8449]" aria-hidden="true" />
        <div>
          <p className="font-semibold text-[#1C2833] text-lg">Meldingen er sendt!</p>
          <p className="text-[#5d6b7a] text-sm mt-1">Vi svarer normalt innen 1 virkedag.</p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-[#2E86AB] hover:underline"
        >
          Send en ny melding
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#1C2833] mb-1">
            Navn <span className="text-[#C0392B]">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={navn}
            onChange={(e) => setNavn(e.target.value)}
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
            required
            value={epost}
            onChange={(e) => setEpost(e.target.value)}
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
          required
          value={emne}
          onChange={(e) => setEmne(e.target.value)}
          className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72] bg-white"
        >
          <option value="">Velg emne...</option>
          <option value="Teknisk support">Teknisk support</option>
          <option value="Fakturering og abonnement">Fakturering og abonnement</option>
          <option value="Funksjonsønske">Funksjonsønske</option>
          <option value="Personvern og data">Personvern og data</option>
          <option value="Bedrift/kommune-tilbud">Bedrift/kommune-tilbud</option>
          <option value="Annet">Annet</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[#1C2833] mb-1">
          Melding <span className="text-[#C0392B]">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          required
          value={melding}
          onChange={(e) => setMelding(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
          placeholder="Beskriv henvendelsen din..."
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-[#C0392B] bg-[#C0392B]/10 rounded-md px-4 py-2">
          {feilmelding}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-[#1B4F72] text-white font-semibold px-6 py-2.5 rounded-md hover:bg-[#16405e] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B4F72] disabled:opacity-60"
      >
        {status === "loading" ? "Sender..." : "Send melding"}
      </button>
    </form>
  );
}
