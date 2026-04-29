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
