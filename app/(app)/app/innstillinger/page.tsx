"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Download, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { ExportPdfButton } from "@/components/app/ExportPdfButton";

export default function InnstillingerPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "account">("profile");
  const [name, setName] = useState(session?.user?.name ?? "");
  const [profileStatus, setProfileStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [profileError, setProfileError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "loading">("idle");

  const handleSaveProfile = async () => {
    setProfileStatus("loading");
    setProfileError("");
    try {
      const res = await fetch("/api/bruker/profil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.error ?? "Klarte ikke å lagre endringer.");
        setProfileStatus("error");
      } else {
        await update({ name: data.name });
        setProfileStatus("success");
        setTimeout(() => setProfileStatus("idle"), 3000);
      }
    } catch {
      setProfileError("Noe gikk galt. Prøv igjen.");
      setProfileStatus("error");
    }
  };

  const handleExportData = async () => {
    try {
      const res = await fetch("/api/bruker/eksport");
      if (!res.ok) throw new Error("Eksport feilet");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hjemtrygg-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Klarte ikke å eksportere data. Prøv igjen.");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "SLETT") {
      alert('Skriv "SLETT" for å bekrefte kontosletting.');
      return;
    }
    setDeleteStatus("loading");
    try {
      const res = await fetch("/api/bruker/profil", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "SLETT" }),
      });
      if (res.ok) {
        await signOut({ callbackUrl: "/" });
      } else {
        const data = await res.json();
        alert(data.error ?? "Klarte ikke å slette konto. Kontakt hei@hjemtrygg.no.");
        setDeleteStatus("idle");
      }
    } catch {
      alert("Noe gikk galt. Kontakt hei@hjemtrygg.no for manuell sletting.");
      setDeleteStatus("idle");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1C2833]">Innstillinger</h1>
        <p className="text-[#5d6b7a] text-sm mt-1">Administrer kontoen din og dine data.</p>
      </div>

      <div className="flex gap-1 mb-6 bg-white rounded-lg border border-[#e5e9ec] p-1 w-fit">
        {[
          { key: "profile", label: "Profil" },
          { key: "security", label: "Sikkerhet" },
          { key: "account", label: "Konto" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === key ? "bg-[#1B4F72] text-white" : "text-[#5d6b7a] hover:text-[#1C2833]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6">
          <h2 className="font-semibold text-[#1C2833] mb-4">Profilinformasjon</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-[#1C2833] mb-1">Navn</label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                placeholder="Ditt navn"
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-[#1C2833] mb-1">E-post</label>
              <input
                id="profile-email"
                type="email"
                value={session?.user?.email ?? ""}
                readOnly
                className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm bg-[#F4F6F7] text-[#5d6b7a] cursor-not-allowed"
              />
              <p className="text-xs text-[#5d6b7a] mt-1">E-post kan endres via lenken i Sikkerhet-fanen.</p>
            </div>

            {profileStatus === "error" && (
              <p className="text-sm text-[#C0392B] bg-[#C0392B]/10 rounded-md px-4 py-2">{profileError}</p>
            )}
            {profileStatus === "success" && (
              <p className="text-sm text-[#1E8449] bg-[#1E8449]/10 rounded-md px-4 py-2 flex items-center gap-2">
                <CheckCircle size={14} aria-hidden="true" /> Endringer lagret.
              </p>
            )}

            <button
              onClick={handleSaveProfile}
              disabled={profileStatus === "loading"}
              className="bg-[#1B4F72] text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#16405e] transition-colors disabled:opacity-60"
            >
              {profileStatus === "loading" ? "Lagrer..." : "Lagre endringer"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6">
          <h2 className="font-semibold text-[#1C2833] mb-4">Sikkerhet</h2>
          <div className="max-w-md space-y-4">
            <div className="bg-[#F4F6F7] rounded-lg p-4">
              <p className="font-medium text-[#1C2833] text-sm mb-1">HjemTrygg bruker passordløs innlogging</p>
              <p className="text-[#5d6b7a] text-sm">
                Vi sender deg en magic link via e-post. Det er ingen passord å huske eller bytte.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#1C2833] mb-2">Endre e-postadresse</p>
              <p className="text-sm text-[#5d6b7a] mb-3">
                For å endre e-postadressen din, send oss en e-post fra din nåværende adresse til{" "}
                <a href="mailto:hei@hjemtrygg.no" className="text-[#2E86AB] hover:underline">
                  hei@hjemtrygg.no
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "account" && (
        <div className="space-y-5">
          <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6">
            <h2 className="font-semibold text-[#1C2833] mb-2">Last ned beredskapsplan (PDF)</h2>
            <p className="text-[#5d6b7a] text-sm mb-4">
              Last ned hele beredskapsplanen din som et PDF-dokument — sjekklister, lager, familieplan og møtepunkter samlet på én gang.
            </p>
            <ExportPdfButton />
          </div>

          <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6">
            <h2 className="font-semibold text-[#1C2833] mb-2">Eksportér mine data</h2>
            <p className="text-[#5d6b7a] text-sm mb-4">
              Last ned alle dine data som JSON (GDPR-rettighet). Inkluderer sjekklister, lager, familieplan og dokumentmetadata.
            </p>
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 border border-[#1B4F72] text-[#1B4F72] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#1B4F72]/10 transition-colors"
            >
              <Download size={16} aria-hidden="true" />
              Last ned mine data (JSON)
            </button>
          </div>

          <div className="bg-white rounded-lg border border-[#C0392B]/30 shadow-sm p-6">
            <h2 className="font-semibold text-[#C0392B] mb-2 flex items-center gap-2">
              <AlertTriangle size={16} aria-hidden="true" />
              Slett konto
            </h2>
            <p className="text-[#5d6b7a] text-sm mb-4">
              Dette vil markere kontoen din som slettet. Data slettes permanent innen 90 dager. Handlingen kan ikke angres.
            </p>
            <div className="space-y-3">
              <div>
                <label htmlFor="delete-confirm" className="block text-sm font-medium text-[#1C2833] mb-1">
                  Skriv SLETT for å bekrefte
                </label>
                <input
                  id="delete-confirm"
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  className="w-48 h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#C0392B]"
                  placeholder="SLETT"
                />
              </div>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== "SLETT" || deleteStatus === "loading"}
                className="flex items-center gap-2 bg-[#C0392B] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#a93226] disabled:opacity-50 transition-colors"
              >
                <Trash2 size={16} aria-hidden="true" />
                {deleteStatus === "loading" ? "Sletter..." : "Slett konto permanent"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
