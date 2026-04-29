"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, Trash2, Check, Lock } from "lucide-react";
import Link from "next/link";
import {
  TEMPLATES,
  PLAN_DISPLAY,
  planHasAccess,
  getTemplateQuota,
  type ChecklistTemplate,
} from "@/lib/checklist-templates";

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

interface TemplateQuotaInfo {
  userPlan: string;
  templatesUsed: number;
  quota: number;
}

const PLAN_BADGE_CLASS: Record<string, string> = {
  demo: "bg-[#1E8449]/10 text-[#1E8449]",
  basis: "bg-[#1B4F72]/10 text-[#1B4F72]",
  pluss: "bg-[#6B48B0]/10 text-[#6B48B0]",
  premium: "bg-[#D4AC0D]/10 text-[#D4AC0D]",
};

export default function SjekklistePage() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<TemplateQuotaInfo>({
    userPlan: "demo",
    templatesUsed: 0,
    quota: 1,
  });
  const [usingTemplate, setUsingTemplate] = useState<string | null>(null);
  const [templateSuccess, setTemplateSuccess] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const newChecklistRef = useRef<HTMLDivElement>(null);

  const fetchChecklists = useCallback(async () => {
    const res = await fetch("/api/checklist");
    if (res.ok) {
      setChecklists(await res.json());
      setFetchError(null);
    } else {
      setFetchError(res.status === 401 ? "Du er ikke innlogget." : "Kunne ikke laste sjekklister.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchChecklists();
    fetch("/api/templates/checklists")
      .then((r) => r.json())
      .then((data) => {
        if (data.userPlan) {
          setQuotaInfo({
            userPlan: data.userPlan,
            templatesUsed: data.templatesUsed ?? 0,
            quota: data.quota ?? 1,
          });
        }
      })
      .catch(() => {});
  }, [fetchChecklists]);

  const createChecklist = async (withTemplate = false) => {
    if (!newTitle.trim() && !withTemplate) return;
    setCreating(true);
    const title = withTemplate
      ? "Min beredskapssjekkliste (DSB-mal)"
      : newTitle.trim();
    const res = await fetch("/api/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      setNewTitle("");
      fetchChecklists();
    }
    setCreating(false);
  };

  const activateTemplate = async (template: ChecklistTemplate) => {
    setUsingTemplate(template.id);
    const res = await fetch("/api/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: template.name,
        fromTemplateId: template.id,
      }),
    });
    if (res.ok) {
      setQuotaInfo((prev) => ({
        ...prev,
        templatesUsed: prev.templatesUsed + 1,
      }));
      setTemplateSuccess(template.id);
      await fetchChecklists();
      setTimeout(() => {
        newChecklistRef.current?.scrollIntoView({ behavior: "smooth" });
        setTemplateSuccess(null);
      }, 1800);
    }
    setUsingTemplate(null);
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

  const { userPlan, templatesUsed, quota } = quotaInfo;
  const quotaReached = isFinite(quota) && templatesUsed >= quota;
  const quotaDisplay = isFinite(quota) ? String(quota) : "ubegrenset";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C2833]">Sjekklister</h1>
          <p className="text-[#5d6b7a] text-sm mt-1">
            Hold oversikt over beredskapsforberedelsene dine.
          </p>
        </div>
      </div>

      {/* Mal-seksjon */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[#1C2833]">
            Offisielle HjemTrygg-maler
          </h2>
          {userPlan !== "premium" && (
            <Link
              href="/app/abonnement"
              className="text-xs text-[#1B4F72] hover:underline"
            >
              Se abonnement
            </Link>
          )}
        </div>

        {/* Kvote-indikator */}
        <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#5d6b7a]">Maler aktivert</span>
            <span className="text-sm font-semibold text-[#1C2833]">
              {templatesUsed} / {quotaDisplay}
            </span>
          </div>
          {isFinite(quota) && (
            <div className="w-full bg-[#e5e9ec] rounded-full h-2 mb-2">
              <div
                className="bg-[#1B4F72] h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (templatesUsed / quota) * 100)}%`,
                }}
              />
            </div>
          )}
          {quotaReached ? (
            <p className="text-xs text-[#C0392B]">
              Du har brukt {templatesUsed} av {quota} tilgjengelige maler.{" "}
              <Link href="/priser" className="underline">
                Oppgrader for tilgang til flere maler.
              </Link>
            </p>
          ) : isFinite(quota) ? (
            <p className="text-xs text-[#5d6b7a]">
              {quota - templatesUsed} mal{quota - templatesUsed !== 1 ? "er" : ""} gjenstår på {PLAN_DISPLAY[userPlan] ?? userPlan}-planen.
            </p>
          ) : (
            <p className="text-xs text-[#5d6b7a]">Ubegrenset tilgang til maler.</p>
          )}
        </div>

        {/* Mal-kort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((template) => {
            const hasAccess = planHasAccess(userPlan, template.minPlan);
            const isDisabled = !hasAccess || quotaReached;
            const isUsing = usingTemplate === template.id;
            const justUsed = templateSuccess === template.id;

            return (
              <div
                key={template.id}
                className={`bg-white rounded-lg border shadow-sm p-5 flex flex-col gap-3 transition-opacity ${
                  !hasAccess ? "opacity-60" : "border-[#e5e9ec]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-[#1C2833] text-sm leading-snug">
                    {template.name}
                  </h3>
                  <span
                    className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-md ${
                      PLAN_BADGE_CLASS[template.minPlan] ??
                      PLAN_BADGE_CLASS.demo
                    }`}
                  >
                    {PLAN_DISPLAY[template.minPlan]}
                  </span>
                </div>

                <p className="text-xs text-[#5d6b7a] leading-relaxed flex-1">
                  {template.description}
                </p>

                {hasAccess ? (
                  <button
                    onClick={() => !isDisabled && activateTemplate(template)}
                    disabled={isDisabled || isUsing}
                    title={
                      quotaReached
                        ? "Du har nådd grensen for din plan"
                        : undefined
                    }
                    className={`w-full text-sm font-semibold py-2 rounded-md transition-colors ${
                      isDisabled || isUsing
                        ? "bg-[#e5e9ec] text-[#9aabb8] cursor-not-allowed"
                        : justUsed
                        ? "bg-[#1E8449] text-white"
                        : "bg-[#1B4F72] text-white hover:bg-[#16405e]"
                    }`}
                  >
                    {isUsing
                      ? "Legger til..."
                      : justUsed
                      ? "Lagt til i dine sjekklister"
                      : quotaReached
                      ? "Kvote nådd"
                      : "Bruk denne malen"}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-[#5d6b7a]">
                    <Lock size={13} className="flex-shrink-0" aria-hidden="true" />
                    <span>
                      Krever{" "}
                      <Link
                        href="/priser"
                        className="text-[#1B4F72] underline font-medium"
                      >
                        {PLAN_DISPLAY[template.minPlan]}-abonnement
                      </Link>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ny sjekkliste */}
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
            aria-label="Navn på ny sjekkliste"
          />
          <button
            onClick={() => createChecklist(false)}
            disabled={!newTitle.trim() || creating}
            className="flex items-center gap-2 bg-[#1B4F72] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#16405e] disabled:opacity-50 transition-colors"
          >
            <Plus size={16} aria-hidden="true" />
            Opprett tom
          </button>
        </div>
      </div>

      {/* Brukernes sjekklister */}
      {loading ? (
        <div className="text-center py-12 text-[#5d6b7a]">
          Laster sjekklister...
        </div>
      ) : fetchError ? (
        <div className="text-center py-12 bg-white rounded-lg border border-[#e5e9ec]">
          <p className="text-[#C0392B] text-sm">{fetchError}</p>
        </div>
      ) : checklists.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-[#e5e9ec]">
          <ClipboardListIcon className="w-12 h-12 text-[#e5e9ec] mx-auto mb-3" />
          <p className="font-medium text-[#1C2833] mb-1">
            Ingen sjekklister ennå
          </p>
          <p className="text-[#5d6b7a] text-sm">
            Velg en mal over, eller opprett en tom sjekkliste.
          </p>
        </div>
      ) : (
        <div className="space-y-4" ref={newChecklistRef}>
          {checklists.map((cl) => {
            const checked = cl.items.filter((i) => i.checked).length;
            const pct =
              cl.items.length > 0
                ? Math.round((checked / cl.items.length) * 100)
                : 0;
            return (
              <div
                key={cl.id}
                className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm"
              >
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
                  <p className="text-xs text-[#5d6b7a] mt-1">
                    {checked} av {cl.items.length} fullført
                  </p>
                </div>
                <ul className="divide-y divide-[#f4f6f7]">
                  {cl.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 px-5 py-3"
                    >
                      <button
                        onClick={() => toggleItem(item.id, !item.checked)}
                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                          item.checked
                            ? "bg-[#1E8449] border-[#1E8449]"
                            : "border-[#e5e9ec] hover:border-[#1B4F72]"
                        }`}
                        aria-label={
                          item.checked
                            ? `Fjern hake: ${item.text}`
                            : `Hak av: ${item.text}`
                        }
                        aria-pressed={item.checked}
                      >
                        {item.checked && (
                          <Check
                            size={12}
                            className="text-white"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                      <span
                        className={`text-sm ${
                          item.checked
                            ? "line-through text-[#9ca3af]"
                            : "text-[#1C2833]"
                        }`}
                      >
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
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    </svg>
  );
}
