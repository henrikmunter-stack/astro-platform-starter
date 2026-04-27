"use client";

import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";

export function PortalButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 border border-[#1B4F72] text-[#1B4F72] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#1B4F72]/10 disabled:opacity-50 transition-colors"
    >
      {loading ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <ExternalLink size={14} aria-hidden="true" />}
      Administrer i Stripe
    </button>
  );
}
