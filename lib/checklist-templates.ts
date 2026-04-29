export type TemplatePlan = "demo" | "basis" | "pluss" | "premium";

const QUOTA: Record<TemplatePlan, number> = {
  demo: 1,
  basis: 10,
  pluss: 50,
  premium: Infinity,
};

export function getTemplateQuota(plan: TemplatePlan | string): number {
  return QUOTA[plan as TemplatePlan] ?? 1;
}

export function canUseTemplate(
  plan: TemplatePlan | string,
  templatesUsed: number
): boolean {
  return templatesUsed < getTemplateQuota(plan);
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  minPlan: TemplatePlan;
}

export const PLAN_DISPLAY: Record<string, string> = {
  demo: "Gratis",
  basis: "Basis",
  pluss: "Pluss",
  premium: "Premium",
};

const PLAN_RANK: Record<string, number> = {
  demo: 0,
  basis: 1,
  pluss: 2,
  premium: 3,
};

export function planHasAccess(
  userPlan: string,
  minPlan: TemplatePlan
): boolean {
  return (PLAN_RANK[userPlan] ?? 0) >= (PLAN_RANK[minPlan] ?? 0);
}

export const TEMPLATES: ChecklistTemplate[] = [
  {
    id: "mal-01a",
    name: "72-timers beredskapssjekkliste",
    description:
      "Grunnleggende hjemmeberedskap. Fyll ut og heng opp på et synlig sted.",
    minPlan: "demo",
  },
  {
    id: "mal-02a",
    name: "Beredskapslager",
    description:
      "Oversikt over hjemmelagrene dine. Fyll ut etter hvert som du handler inn.",
    minPlan: "basis",
  },
  {
    id: "mal-03a",
    name: "Familieplan",
    description:
      "Kontakter, møtesteder og avtaler. Lagre et trykt eksemplar tilgjengelig for alle.",
    minPlan: "basis",
  },
  {
    id: "mal-04a",
    name: "Evakueringsplan",
    description:
      "Forbered deg på å forlate hjemmet raskt og trygt. Test planen årlig.",
    minPlan: "basis",
  },
  {
    id: "mal-05a",
    name: "Beredskap ved strømbrudd",
    description:
      "Handlingsplan og forberedelsesguide. Strømbrudd er den vanligste krisesituasjonen i Norge.",
    minPlan: "basis",
  },
  {
    id: "mal-06a",
    name: "Beredskap ved ekstremvær",
    description:
      "Handlingsplan for storm, flom og snøskred. Tilpass til din region og boligsituasjon.",
    minPlan: "basis",
  },
  {
    id: "mal-07a",
    name: "Beredskapsøvelse",
    description:
      "Familieøvelse — gjennomføring og evaluering. Sett av 2–3 timer og gjennomfør realistisk.",
    minPlan: "basis",
  },
];
