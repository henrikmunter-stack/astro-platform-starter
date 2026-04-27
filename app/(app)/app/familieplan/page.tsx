"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Phone, Mail, MapPin } from "lucide-react";

interface FamilyContact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  role: string | null;
  notes: string | null;
}

interface MeetingPoint {
  id: string;
  name: string;
  address: string | null;
  description: string | null;
  priority: number;
}

const ROLES = ["barn", "ektefelle", "forelder", "nabo", "annet"];

export default function FamilieplanPage() {
  const [contacts, setContacts] = useState<FamilyContact[]>([]);
  const [meetingPoints, setMeetingPoints] = useState<MeetingPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"contacts" | "meeting">("contacts");
  const [showContactForm, setShowContactForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "", role: "annet", notes: "" });
  const [meetingForm, setMeetingForm] = useState({ name: "", address: "", description: "", priority: "1" });

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/family");
    if (res.ok) {
      const data = await res.json();
      setContacts(data.contacts);
      setMeetingPoints(data.meetingPoints);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/family?type=contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactForm),
    });
    if (res.ok) {
      setContactForm({ name: "", phone: "", email: "", role: "annet", notes: "" });
      setShowContactForm(false);
      fetchData();
    }
  };

  const addMeetingPoint = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/family?type=meetingpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...meetingForm, priority: parseInt(meetingForm.priority) }),
    });
    if (res.ok) {
      setMeetingForm({ name: "", address: "", description: "", priority: "1" });
      setShowMeetingForm(false);
      fetchData();
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Slett denne kontakten?")) return;
    await fetch(`/api/family?id=${id}&type=contact`, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const deleteMeetingPoint = async (id: string) => {
    if (!confirm("Slett dette m\xF8tepunktet?")) return;
    await fetch(`/api/family?id=${id}&type=meetingpoint`, { method: "DELETE" });
    setMeetingPoints((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1C2833]">Familieplan</h1>
        <p className="text-[#5d6b7a] text-sm mt-1">Kontakter og m\xF8tepunkter for din families beredskapsplan.</p>
      </div>

      <div className="flex gap-1 mb-6 bg-white rounded-lg border border-[#e5e9ec] p-1 w-fit">
        {[{ key: "contacts", label: `Kontakter (${contacts.length})` }, { key: "meeting", label: `M\xF8tepunkter (${meetingPoints.length})` }].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as "contacts" | "meeting")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === key ? "bg-[#1B4F72] text-white" : "text-[#5d6b7a] hover:text-[#1C2833]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "contacts" && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowContactForm(!showContactForm)}
              className="flex items-center gap-2 bg-[#1B4F72] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#16405e] transition-colors"
            >
              <Plus size={16} aria-hidden="true" />
              Legg til kontakt
            </button>
          </div>

          {showContactForm && (
            <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6 mb-4">
              <form onSubmit={addContact} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C2833] mb-1">Navn *</label>
                  <input required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]" placeholder="Fullt navn" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C2833] mb-1">Rolle</label>
                  <select value={contactForm.role} onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })} className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72] bg-white">
                    {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C2833] mb-1">Telefon</label>
                  <input type="tel" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]" placeholder="+47 xxx xx xxx" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C2833] mb-1">E-post</label>
                  <input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]" placeholder="epost@eksempel.no" />
                </div>
                <div className="sm:col-span-2 flex gap-3">
                  <button type="submit" className="bg-[#1B4F72] text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#16405e] transition-colors">Lagre</button>
                  <button type="button" onClick={() => setShowContactForm(false)} className="border border-[#e5e9ec] text-[#5d6b7a] text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#F4F6F7] transition-colors">Avbryt</button>
                </div>
              </form>
            </div>
          )}

          {loading ? <p className="text-[#5d6b7a] text-center py-8">Laster...</p> : contacts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-[#e5e9ec]">
              <p className="font-medium text-[#1C2833]">Ingen kontakter enn\xE5</p>
              <p className="text-[#5d6b7a] text-sm">Legg til familiemedlemmer, naboer og andre viktige kontakter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-[#1C2833]">{contact.name}</h3>
                      {contact.role && <span className="text-xs text-[#2E86AB] font-medium">{contact.role}</span>}
                    </div>
                    <button onClick={() => deleteContact(contact.id)} className="p-1 text-[#5d6b7a] hover:text-[#C0392B] rounded" aria-label={`Slett ${contact.name}`}>
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-[#5d6b7a] hover:text-[#1B4F72]">
                        <Phone size={13} aria-hidden="true" />
                        {contact.phone}
                      </a>
                    )}
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-[#5d6b7a] hover:text-[#1B4F72]">
                        <Mail size={13} aria-hidden="true" />
                        {contact.email}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "meeting" && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowMeetingForm(!showMeetingForm)}
              className="flex items-center gap-2 bg-[#1B4F72] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#16405e] transition-colors"
            >
              <Plus size={16} aria-hidden="true" />
              Legg til m\xF8tepunkt
            </button>
          </div>

          {showMeetingForm && (
            <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-6 mb-4">
              <form onSubmit={addMeetingPoint} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C2833] mb-1">Navn *</label>
                  <input required value={meetingForm.name} onChange={(e) => setMeetingForm({ ...meetingForm, name: e.target.value })} className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]" placeholder="F.eks. Utenfor skolen" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C2833] mb-1">Adresse</label>
                  <input value={meetingForm.address} onChange={(e) => setMeetingForm({ ...meetingForm, address: e.target.value })} className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]" placeholder="Gateadresse" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C2833] mb-1">Prioritet (1 = h\xF8yest)</label>
                  <select value={meetingForm.priority} onChange={(e) => setMeetingForm({ ...meetingForm, priority: e.target.value })} className="w-full h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72] bg-white">
                    <option value="1">1 – H\xF8yeste prioritet</option>
                    <option value="2">2 – Alternativt m\xF8tepunkt</option>
                    <option value="3">3 – Reserve</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="bg-[#1B4F72] text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#16405e] transition-colors">Lagre</button>
                  <button type="button" onClick={() => setShowMeetingForm(false)} className="border border-[#e5e9ec] text-[#5d6b7a] text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#F4F6F7] transition-colors">Avbryt</button>
                </div>
              </form>
            </div>
          )}

          {meetingPoints.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-[#e5e9ec]">
              <p className="font-medium text-[#1C2833]">Ingen m\xF8tepunkter enn\xE5</p>
              <p className="text-[#5d6b7a] text-sm">DSB anbefaler \xE5 ha minst to avtalte m\xF8tepunkter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {meetingPoints.sort((a, b) => a.priority - b.priority).map((mp) => (
                <div key={mp.id} className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#1B4F72] text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
                      {mp.priority}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C2833]">{mp.name}</h3>
                      {mp.address && (
                        <p className="flex items-center gap-1 text-sm text-[#5d6b7a] mt-0.5">
                          <MapPin size={12} aria-hidden="true" />
                          {mp.address}
                        </p>
                      )}
                      {mp.description && <p className="text-sm text-[#5d6b7a] mt-1">{mp.description}</p>}
                    </div>
                  </div>
                  <button onClick={() => deleteMeetingPoint(mp.id)} className="p-1 text-[#5d6b7a] hover:text-[#C0392B] rounded flex-shrink-0" aria-label={`Slett m\xF8tepunkt: ${mp.name}`}>
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
