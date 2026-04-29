"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, AlertTriangle, Clock, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiresAt: string | null;
  reminderDate: string | null;
  reminderSentAt: string | null;
  notes: string | null;
}

const CATEGORIES = ["mat", "vann", "medisiner", "utstyr", "sikkerhetsutstyr", "annet"] as const;
const UNITS = ["liter", "stk", "kg", "dager"] as const;
const CATEGORY_LABELS: Record<string, string> = {
  mat: "Mat",
  vann: "Vann",
  medisiner: "Medisiner",
  utstyr: "Utstyr",
  sikkerhetsutstyr: "Sikkerhetsutstyr",
  annet: "Annet",
};

const EMPTY_FORM = {
  name: "",
  category: "mat" as string,
  quantity: "",
  unit: "stk" as string,
  expiresAt: "",
  reminderDate: "",
  notes: "",
};

function addMonths(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}

function addYears(years: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().split("T")[0];
}

const SAFETY_PRESETS = [
  {
    name: "Brannvarsler",
    category: "sikkerhetsutstyr",
    quantity: 1,
    unit: "stk",
    notes: "Anbefalt batteriskift: hvert 12. måned",
    reminderDate: addMonths(12),
  },
  {
    name: "Røykdetektor",
    category: "sikkerhetsutstyr",
    quantity: 1,
    unit: "stk",
    notes: "Test månedlig. Bytt hele enheten etter 10 år.",
    reminderDate: addMonths(1),
  },
  {
    name: "Brannslukkingsapparat",
    category: "sikkerhetsutstyr",
    quantity: 1,
    unit: "stk",
    notes: "Service hvert 5. år av godkjent kontrollør",
    reminderDate: addYears(5),
  },
  {
    name: "Nødlys",
    category: "sikkerhetsutstyr",
    quantity: 1,
    unit: "stk",
    notes: "Test månedlig. Kontroller at batteriet lader.",
    reminderDate: addMonths(1),
  },
];

function getReminderStatus(reminderDate: string | null): "overdue" | "soon" | "ok" | null {
  if (!reminderDate) return null;
  const now = Date.now();
  const ts = new Date(reminderDate).getTime();
  const days = Math.floor((ts - now) / (1000 * 60 * 60 * 24));
  if (days < 0) return "overdue";
  if (days <= 14) return "soon";
  return "ok";
}

export default function LagerPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("alle");
  const [showForm, setShowForm] = useState(false);
  const [showSafetySetup, setShowSafetySetup] = useState(false);
  const [selectedPresets, setSelectedPresets] = useState<Set<number>>(
    new Set(SAFETY_PRESETS.map((_, i) => i))
  );
  const [addingPresets, setAddingPresets] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/inventory");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        quantity: parseFloat(form.quantity),
        expiresAt: form.expiresAt || null,
        reminderDate: form.reminderDate || null,
      }),
    });
    if (res.ok) {
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchItems();
    }
  };

  const addSafetyPresets = async () => {
    const toAdd = SAFETY_PRESETS.filter((_, i) => selectedPresets.has(i));
    if (toAdd.length === 0) return;
    setAddingPresets(true);
    const res = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toAdd),
    });
    if (res.ok) {
      setShowSafetySetup(false);
      setSelectedPresets(new Set(SAFETY_PRESETS.map((_, i) => i)));
      fetchItems();
    }
    setAddingPresets(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Slett denne lagervaren?")) return;
    await fetch(`/api/inventory?id=${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const filtered = activeCategory === "alle" ? items : items.filter((i) => i.category === activeCategory);
  const overdueItems = items.filter((i) => getReminderStatus(i.reminderDate) === "overdue");
  const soonItems = items.filter((i) => getReminderStatus(i.reminderDate) === "soon");
  const expiringItems = items.filter((i) => {
    if (!i.expiresAt) return false;
    const days = Math.floor((new Date(i.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days >= 0 && days <= 30;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C2833]">Mitt lager</h1>
          <p className="text-[#5d6b7a] text-sm mt-1">Hold oversikt over beredskapsbeholdningen din.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSafetySetup(!showSafetySetup)}
            className="flex items-center gap-2 border border-[#1B4F72] text-[#1B4F72] text-sm font-semibold px-3 py-2 rounded-md hover:bg-[#1B4F72]/5 transition-colors"
          >
            <ShieldCheck size={16} aria-hidden="true" />
            Sikkerhetsutstyr
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[#1B4F72] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#16405e] transition-colors"
          >
            <Plus size={16} aria-hidden="true" />
            Legg til vare
          </button>
        </div>
      </div>

      {overdueItems.length > 0 && (
        <div className="bg-[#C0392B]/10 border border-[#C0392B]/30 rounded-lg p-4 mb-3 flex items-start gap-3">
          <AlertTriangle size={16} className="text-[#C0392B] mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-[#1C2833]">
            <strong>{overdueItems.length} vare(r)</strong> har passert roterings-/byttedato:{" "}
            {overdueItems.map((i) => i.name).join(", ")}
          </p>
        </div>
      )}

      {soonItems.length > 0 && (
        <div className="bg-[#D4AC0D]/10 border border-[#D4AC0D]/30 rounded-lg p-4 mb-3 flex items-start gap-3">
          <Clock size={16} className="text-[#D4AC0D] mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-[#1C2833]">
            <strong>{soonItems.length} vare(r)</strong> må roteres/byttes innen 14 dager:{" "}
            {soonItems.map((i) => i.name).join(", ")}
          </p>
        </div>
      )}

      {expiringItems.length > 0 && (
        <div className="bg-[#C0392B]/10 border border-[#C0392B]/30 rounded-lg p-4 mb-3 flex items-start gap-3">
          <AlertTriangle size={16} className="text-[#C0392B] mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-[#1C2833]">
            <strong>{expiringItems.length} vare(r)</strong> utløper innen 30 dager:{" "}
            {expiringItems.map((i) => i.name).join(", ")}
          </p>
        </div>
      )}

      {showSafetySetup && (
        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={18} className="text-[#1B4F72]" aria-hidden="true" />
            <h2 className="font-semibold text-[#1C2833]">Hurtigoppsett: Sikkerhetsutstyr</h2>
          </div>
          <p className="text-[#5d6b7a] text-sm mb-4">
            Legg til standard sikkerhetsutstyr med anbefalte vedlikeholdsfrister satt automatisk.
          </p>
          <div className="space-y-3 mb-5">
            {SAFETY_PRESETS.map((preset, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedPresets.has(i)}
                  onChange={(e) => {
                    const next = new Set(selectedPresets);
                    e.target.checked ? next.add(i) : next.delete(i);
                    setSelectedPresets(next);
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-[#e5e9ec] accent-[#1B4F72]"
                />
                <div>
                  <span className="text-sm font-medium text-[#1C2833]">{preset.name}</span>
                  <p className="text-xs text-[#5d6b7a]">{preset.notes}</p>
                  <p className="text-xs text-[#2E86AB]">Neste frist: {formatDate(preset.reminderDate)}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={addSafetyPresets}
              disabled={addingPresets || selectedPresets.size === 0}
              className="bg-[#1B4F72] text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#16405e] disabled:opacity-50 transition-colors"
            >
              {addingPresets ? "Legger til..." : `Legg til ${selectedPresets.size} vare${selectedPresets.size !== 1 ? "r" : ""}`}
            </button>
            <button
              type="button"
              onClick={() => setShowSafetySetup(false)}
              className="border border-[#e5e9ec] text-[#5d6b7a] text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#F4F6F7] transition-colors"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-[#1C2833] mb-4">Ny lagervare</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="item-name" className="block text-sm font-medium text-[#1C2833] mb-1">Navn</label>
              <input
                id="item-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                placeholder="F.eks. Hermetisert tunfisk"
              />
            </div>
            <div>
              <label htmlFor="item-category" className="block text-sm font-medium text-[#1C2833] mb-1">Kategori</label>
              <select
                id="item-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72] bg-white"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="item-qty" className="block text-sm font-medium text-[#1C2833] mb-1">Mengde</label>
                <input
                  id="item-qty"
                  required
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
                />
              </div>
              <div className="w-28">
                <label htmlFor="item-unit" className="block text-sm font-medium text-[#1C2833] mb-1">Enhet</label>
                <select
                  id="item-unit"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72] bg-white"
                >
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="item-expires" className="block text-sm font-medium text-[#1C2833] mb-1">Utløpsdato (valgfritt)</label>
              <input
                id="item-expires"
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
              />
            </div>
            <div>
              <label htmlFor="item-reminder" className="block text-sm font-medium text-[#1C2833] mb-1">Roteres/byttes innen (valgfritt)</label>
              <input
                id="item-reminder"
                type="date"
                value={form.reminderDate}
                onChange={(e) => setForm({ ...form, reminderDate: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="bg-[#1B4F72] text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#16405e] transition-colors">
                Lagre
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-[#e5e9ec] text-[#5d6b7a] text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#F4F6F7] transition-colors">
                Avbryt
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-2 flex-wrap mb-5">
        {["alle", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-[#1B4F72] text-white"
                : "bg-white border border-[#e5e9ec] text-[#5d6b7a] hover:border-[#1B4F72]"
            }`}
          >
            {cat === "alle" ? "Alle" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#5d6b7a]">Laster lager...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-[#e5e9ec]">
          <p className="font-medium text-[#1C2833] mb-1">Ingen lagervarer i denne kategorien</p>
          <p className="text-[#5d6b7a] text-sm">Klikk &quot;Legg til vare&quot; for å starte lageret ditt.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F4F6F7] border-b border-[#e5e9ec]">
                <th className="text-left p-4 font-semibold text-[#1C2833]">Navn</th>
                <th className="text-left p-4 font-semibold text-[#1C2833] hidden sm:table-cell">Kategori</th>
                <th className="text-left p-4 font-semibold text-[#1C2833]">Mengde</th>
                <th className="text-left p-4 font-semibold text-[#1C2833] hidden md:table-cell">Utløpsdato</th>
                <th className="text-left p-4 font-semibold text-[#1C2833] hidden lg:table-cell">Roteres/byttes</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F6F7]">
              {filtered.map((item) => {
                const status = getReminderStatus(item.reminderDate);
                const expiringSoon = (() => {
                  if (!item.expiresAt) return false;
                  const d = Math.floor((new Date(item.expiresAt).getTime() - Date.now()) / 86400000);
                  return d >= 0 && d <= 30;
                })();
                const rowBg = status === "overdue" || expiringSoon
                  ? "bg-[#C0392B]/5"
                  : status === "soon"
                  ? "bg-[#D4AC0D]/5"
                  : "hover:bg-[#F4F6F7]/50";

                return (
                  <tr key={item.id} className={rowBg}>
                    <td className="p-4 font-medium text-[#1C2833]">
                      <span>{item.name}</span>
                      {(status === "overdue" || expiringSoon) && (
                        <AlertTriangle size={13} className="inline ml-2 text-[#C0392B]" aria-label="Krever oppmerksomhet" />
                      )}
                      {status === "soon" && !expiringSoon && (
                        <Clock size={13} className="inline ml-2 text-[#D4AC0D]" aria-label="Snart frist" />
                      )}
                    </td>
                    <td className="p-4 text-[#5d6b7a] hidden sm:table-cell">{CATEGORY_LABELS[item.category] ?? item.category}</td>
                    <td className="p-4 text-[#1C2833]">{item.quantity} {item.unit}</td>
                    <td className="p-4 text-[#5d6b7a] hidden md:table-cell">
                      {item.expiresAt ? (
                        <span className={expiringSoon ? "text-[#C0392B] font-medium" : ""}>
                          {formatDate(item.expiresAt)}
                        </span>
                      ) : "–"}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      {item.reminderDate ? (
                        <span className={
                          status === "overdue" ? "text-[#C0392B] font-medium text-xs" :
                          status === "soon" ? "text-[#D4AC0D] font-medium text-xs" :
                          "text-[#5d6b7a] text-xs"
                        }>
                          {status === "overdue" && "⚠️ "}
                          {status === "soon" && "🕐 "}
                          {formatDate(item.reminderDate)}
                        </span>
                      ) : "–"}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1.5 text-[#5d6b7a] hover:text-[#C0392B] rounded"
                        aria-label={`Slett vare: ${item.name}`}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
