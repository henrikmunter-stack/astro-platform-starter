"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, AlertTriangle, Edit3 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiresAt: string | null;
  notes: string | null;
}

const CATEGORIES = ["mat", "vann", "medisiner", "utstyr", "annet"];
const UNITS = ["liter", "stk", "kg", "dager"];
const CATEGORY_LABELS: Record<string, string> = {
  mat: "Mat",
  vann: "Vann",
  medisiner: "Medisiner",
  utstyr: "Utstyr",
  annet: "Annet",
};

function isExpiringSoon(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  const daysUntil = Math.floor(
    (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return daysUntil >= 0 && daysUntil <= 30;
}

export default function LagerPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("alle");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "mat",
    quantity: "",
    unit: "stk",
    expiresAt: "",
    notes: "",
  });

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
      }),
    });
    if (res.ok) {
      setForm({ name: "", category: "mat", quantity: "", unit: "stk", expiresAt: "", notes: "" });
      setShowForm(false);
      fetchItems();
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Slett denne lagervaren?")) return;
    await fetch(`/api/inventory?id=${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const filtered = activeCategory === "alle" ? items : items.filter((i) => i.category === activeCategory);
  const expiring = items.filter((i) => isExpiringSoon(i.expiresAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C2833]">Mitt lager</h1>
          <p className="text-[#5d6b7a] text-sm mt-1">Hold oversikt over beredskapsbeholdningen din.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#1B4F72] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#16405e] transition-colors"
        >
          <Plus size={16} aria-hidden="true" />
          Legg til vare
        </button>
      </div>

      {expiring.length > 0 && (
        <div className="bg-[#C0392B]/10 border border-[#C0392B]/30 rounded-lg p-4 mb-5 flex items-start gap-3">
          <AlertTriangle size={16} className="text-[#C0392B] mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-[#1C2833]">
            <strong>{expiring.length} vare(r)</strong> utløper innen 30 dager:{" "}
            {expiring.map((i) => i.name).join(", ")}
          </p>
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
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F6F7]">
              {filtered.map((item) => (
                <tr key={item.id} className={isExpiringSoon(item.expiresAt) ? "bg-[#C0392B]/5" : "hover:bg-[#F4F6F7]/50"}>
                  <td className="p-4 font-medium text-[#1C2833]">
                    {item.name}
                    {isExpiringSoon(item.expiresAt) && (
                      <AlertTriangle size={14} className="inline ml-2 text-[#C0392B]" aria-label="Utløper snart" />
                    )}
                  </td>
                  <td className="p-4 text-[#5d6b7a] hidden sm:table-cell">{CATEGORY_LABELS[item.category] ?? item.category}</td>
                  <td className="p-4 text-[#1C2833]">{item.quantity} {item.unit}</td>
                  <td className="p-4 text-[#5d6b7a] hidden md:table-cell">
                    {item.expiresAt ? formatDate(item.expiresAt) : "–"}
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
