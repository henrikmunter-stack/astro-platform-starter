"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Check } from "lucide-react";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  order: number;
}

interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

const DSB_TEMPLATE = [
  "Drikkevann (3 liter per person per dag i 7 dager)",
  "Hermetikk og tørrmat for 7 dager",
  "Medisiner og reseptbelagte legemidler",
  "Førstehjelpsutstyr",
  "Batteridrevet eller håndsvingradio",
  "Hodelykt og ekstra batterier",
  "Stearinlys og fyrstikker",
  "Fyrstikker og lighter",
  "Varme klær og tepper",
  "Kraftbank (powerbank) til mobiltelefon",
  "Kontanter (noen sedler og mynter)",
  "Kopier av viktige dokumenter (pass, forsikring)",
  "Åpner for hermetikk",
  "Kokeapparat som ikke er avhengig av strøm",
  "Jodtabletter (ved atomulykke – oppbevar hjemme)",
  "Liste over nødtelefonnumre på papir",
  "Møtepunkter avtalt med familien",
  "Plan for å hente barn fra skole/barnehage",
  "Nabokontakt avklart",
  "Bil med full tank",
];

export default function SjekklistePage() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchChecklists = useCallback(async () => {
    const res = await fetch("/api/checklist");
    if (res.ok) setChecklists(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchChecklists();
  }, [fetchChecklists]);

  const createChecklist = async (withTemplate = false) => {
    if (!newTitle.trim() && !withTemplate) return;
    setCreating(true);
    const title = withTemplate ? "Min beredskapssjekkliste (DSB-mal)" : newTitle.trim();
    const items = withTemplate ? DSB_TEMPLATE.map((text) => ({ text, checked: false })) : undefined;

    const res = await fetch("/api/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, items }),
    });
    if (res.ok) {
      setNewTitle("");
      fetchChecklists();
    }
    setCreating(false);
  };

  const toggleItem = async (itemId: string, checked: boolean) => {
    await fetch("/api/checklist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, checked }),
    });
    setChecklists((prev) =>
      prev.map((cl) => ({
        ...cl,
        items: cl.items.map((item) =>
          item.id === itemId ? { ...item, checked } : item
        ),
      }))
    );
  };

  const deleteChecklist = async (id: string) => {
    if (!confirm("Er du sikker på at du vil slette denne sjekklisten?")) return;
    await fetch(`/api/checklist?id=${id}`, { method: "DELETE" });
    setChecklists((prev) => prev.filter((cl) => cl.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C2833]">Sjekklister</h1>
          <p className="text-[#5d6b7a] text-sm mt-1">Hold oversikt over beredskapsforberedelsene dine.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-5 mb-6">
        <h2 className="font-semibold text-[#1C2833] mb-3">Ny sjekkliste</h2>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Navn på sjekklisten..."
            className="flex-1 min-w-[200px] h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
            onKeyDown={(e) => e.key === "Enter" && createChecklist(false)}
            aria-label="Navn p\xE5 ny sjekkliste"
          />
          <button
            onClick={() => createChecklist(false)}
            disabled={!newTitle.trim() || creating}
            className="flex items-center gap-2 bg-[#1B4F72] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#16405e] disabled:opacity-50 transition-colors"
          >
            <Plus size={16} aria-hidden="true" />
            Opprett
          </button>
          <button
            onClick={() => createChecklist(true)}
            disabled={creating}
            className="flex items-center gap-2 border border-[#1B4F72] text-[#1B4F72] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#1B4F72]/10 disabled:opacity-50 transition-colors"
          >
            Bruk DSB-mal
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#5d6b7a]">Laster sjekklister...</div>
      ) : checklists.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-[#e5e9ec]">
          <ClipboardListIcon className="w-12 h-12 text-[#e5e9ec] mx-auto mb-3" />
          <p className="font-medium text-[#1C2833] mb-1">Ingen sjekklister enn\xE5</p>
          <p className="text-[#5d6b7a] text-sm">Opprett din f\xF8rste sjekkliste over, eller bruk DSB-malen.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {checklists.map((cl) => {
            const checked = cl.items.filter((i) => i.checked).length;
            const pct = cl.items.length > 0 ? Math.round((checked / cl.items.length) * 100) : 0;
            return (
              <div key={cl.id} className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm">
                <div className="p-5 border-b border-[#e5e9ec]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-[#1C2833]">{cl.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#5d6b7a]">{pct}%</span>
                      <button
                        onClick={() => deleteChecklist(cl.id)}
                        className="p-1.5 text-[#5d6b7a] hover:text-[#C0392B] rounded"
                        aria-label={`Slett sjekkliste: ${cl.title}`}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-[#e5e9ec] rounded-full h-2">
                    <div
                      className="bg-[#1E8449] h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#5d6b7a] mt-1">{checked} av {cl.items.length} fullf\xF8rt</p>
                </div>
                <ul className="divide-y divide-[#f4f6f7]">
                  {cl.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                      <button
                        onClick={() => toggleItem(item.id, !item.checked)}
                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                          item.checked
                            ? "bg-[#1E8449] border-[#1E8449]"
                            : "border-[#e5e9ec] hover:border-[#1B4F72]"
                        }`}
                        aria-label={item.checked ? `Fjern hake: ${item.text}` : `Hak av: ${item.text}`}
                        aria-pressed={item.checked}
                      >
                        {item.checked && <Check size={12} className="text-white" aria-hidden="true" />}
                      </button>
                      <span className={`text-sm ${item.checked ? "line-through text-[#9ca3af]" : "text-[#1C2833]"}`}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ClipboardListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}
