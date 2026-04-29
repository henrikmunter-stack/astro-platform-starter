"use client";

import { useEffect, useState, useCallback } from "react";
import { FileText, Trash2, Upload, Info } from "lucide-react";
import { formatDate, formatBytes } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  description: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  uploadedAt: string;
}

export default function DokumenterPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const fetchDocs = useCallback(async () => {
    const res = await fetch("/api/documents");
    if (res.ok) setDocuments(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: "", description: "" });
      setShowForm(false);
      fetchDocs();
    }
  };

  const deleteDoc = async (id: string) => {
    if (!confirm("Slett dette dokumentet?")) return;
    await fetch(`/api/documents?id=${id}`, { method: "DELETE" });
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C2833]">Dokumenter</h1>
          <p className="text-[#5d6b7a] text-sm mt-1">Lagre viktige dokumenter trygt og tilgjengelig.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#1B4F72] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#16405e] transition-colors"
        >
          <Upload size={16} aria-hidden="true" />
          Legg til dokument
        </button>
      </div>

      <div className="bg-[#1B4F72]/5 border border-[#1B4F72]/20 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Info size={16} className="text-[#1B4F72] mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-[#1C2833]">Dokumentlagring krever oppsett</p>
          <p className="text-sm text-[#5d6b7a]">
            For faktisk filopplasting må du konfigurere en lagringstjeneste (Supabase Storage eller AWS S3)
            via miljøvariablene STORAGE_PROVIDER, STORAGE_BUCKET og STORAGE_URL.
            Metadata lagres allerede i databasen.
          </p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6 mb-5">
          <h2 className="font-semibold text-[#1C2833] mb-4">Nytt dokument</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1C2833] mb-1">Dokumentnavn *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]" placeholder="F.eks. Pass – Kari Nordmann" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1C2833] mb-1">Beskrivelse</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]" placeholder="Kort beskrivelse" />
            </div>
            <div className="border-2 border-dashed border-[#e5e9ec] rounded-lg p-8 text-center">
              <Upload size={24} className="text-[#e5e9ec] mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm text-[#5d6b7a]">Filopplasting krever konfigurert lagringsprovider</p>
              <p className="text-xs text-[#9ca3af] mt-1">Se README.md for oppsett av Supabase Storage</p>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-[#1B4F72] text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#16405e] transition-colors">Lagre metadata</button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-[#e5e9ec] text-[#5d6b7a] text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#F4F6F7] transition-colors">Avbryt</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-[#5d6b7a]">Laster dokumenter...</div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-[#e5e9ec]">
          <FileText size={32} className="text-[#e5e9ec] mx-auto mb-2" aria-hidden="true" />
          <p className="font-medium text-[#1C2833]">Ingen dokumenter ennå</p>
          <p className="text-[#5d6b7a] text-sm">Legg til pass, forsikringer og andre viktige dokumenter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm divide-y divide-[#F4F6F7]">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-md bg-[#1B4F72]/10 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-[#1B4F72]" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#1C2833] text-sm truncate">{doc.name}</p>
                <p className="text-xs text-[#5d6b7a]">
                  {formatDate(doc.uploadedAt)}
                  {doc.sizeBytes && ` – ${formatBytes(doc.sizeBytes)}`}
                </p>
              </div>
              <button onClick={() => deleteDoc(doc.id)} className="p-1.5 text-[#5d6b7a] hover:text-[#C0392B] rounded flex-shrink-0" aria-label={`Slett dokument: ${doc.name}`}>
                <Trash2 size={15} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
