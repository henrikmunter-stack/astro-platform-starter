"use client";

import { useState, useEffect } from "react";
import { FileDown, Lock, Loader2 } from "lucide-react";
import Link from "next/link";

export function ExportPdfButton() {
  const [canExport, setCanExport] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/templates/checklists")
      .then((r) => r.json())
      .then((d) => {
        const plan = d.userPlan ?? "demo";
        setCanExport(plan === "pluss" || plan === "premium");
      })
      .catch(() => setCanExport(false));
  }, []);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/export/pdf");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Klarte ikke å generere PDF. Prøv igjen.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hjemtrygg-beredskapsplan-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Noe gikk galt. Sjekk internettilkoblingen og prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  if (canExport === null) {
    return (
      <div className="flex items-center gap-2 h-10 px-4 text-sm text-[#5d6b7a]">
        <Loader2 size={14} className="animate-spin" aria-hidden="true" />
        Laster...
      </div>
    );
  }

  if (!canExport) {
    return (
      <div className="flex items-center gap-3 bg-[#F4F6F7] border border-[#e5e9ec] rounded-lg px-4 py-3">
        <Lock size={15} className="text-[#9aabb8] flex-shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-[#1C2833]">PDF-eksport krever Pluss eller Premium</p>
          <p className="text-xs text-[#5d6b7a]">
            Last ned beredskapsplanen din som PDF-dokument.{" "}
            <Link href="/priser" className="text-[#1B4F72] underline font-medium">
              Oppgrader abonnement
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 bg-[#1B4F72] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#16405e] disabled:opacity-60 transition-colors"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
      ) : (
        <FileDown size={16} aria-hidden="true" />
      )}
      {loading ? "Genererer PDF..." : "Last ned som PDF"}
    </button>
  );
}
