export type PlanKey = "demo" | "basis" | "pluss" | "premium";

export interface PlanFeatures {
  maxChecklists: number;
  maxInventoryItems: number;
  maxFamilyContacts: number;
  maxDocuments: number;
  chatMessagesPerMonth: number;
  canExport: boolean;
  advancedTemplates: boolean;
  prioritySupport: boolean;
}

export interface Plan {
  name: string;
  price: number;
  priceLabel: string;
  stripePriceId: string | undefined;
  features: PlanFeatures;
  description: string;
}

export const PLANS: Record<PlanKey, Plan> = {
  demo: {
    name: "Demo",
    price: 0,
    priceLabel: "Gratis",
    stripePriceId: undefined,
    features: {
      maxChecklists: 1,
      maxInventoryItems: 10,
      maxFamilyContacts: 3,
      maxDocuments: 0,
      chatMessagesPerMonth: 10,
      canExport: false,
      advancedTemplates: false,
      prioritySupport: false,
    },
    description: "Kom i gang med beredskap – gratis for alltid.",
  },
  basis: {
    name: "Basis",
    price: 99,
    priceLabel: "99 kr/mnd",
    stripePriceId: process.env.STRIPE_PRICE_ID_BASIS,
    features: {
      maxChecklists: 10,
      maxInventoryItems: 200,
      maxFamilyContacts: 20,
      maxDocuments: 0,
      chatMessagesPerMonth: 200,
      canExport: false,
      advancedTemplates: false,
      prioritySupport: false,
    },
    description: "For familien som vil ta beredskap på alvor.",
  },
  pluss: {
    name: "Pluss",
    price: 199,
    priceLabel: "199 kr/mnd",
    stripePriceId: process.env.STRIPE_PRICE_ID_PLUSS,
    features: {
      maxChecklists: 50,
      maxInventoryItems: 1000,
      maxFamilyContacts: 50,
      maxDocuments: 25,
      chatMessagesPerMonth: 1000,
      canExport: false,
      advancedTemplates: true,
      prioritySupport: false,
    },
    description: "Full tilgang til dokumenter og prioriterte maler.",
  },
  premium: {
    name: "Premium",
    price: 349,
    priceLabel: "349 kr/mnd",
    stripePriceId: process.env.STRIPE_PRICE_ID_PREMIUM,
    features: {
      maxChecklists: Infinity,
      maxInventoryItems: Infinity,
      maxFamilyContacts: Infinity,
      maxDocuments: Infinity,
      chatMessagesPerMonth: Infinity,
      canExport: true,
      advancedTemplates: true,
      prioritySupport: true,
    },
    description: "Ubegrenset tilgang og avanserte beredskapsøvelser.",
  },
};

export type SubscriptionLike = {
  plan: string;
  chatMessagesThisMonth: number;
} | null;

export function canAccess(
  subscription: SubscriptionLike,
  feature: keyof PlanFeatures
): boolean {
  const planKey = (subscription?.plan ?? "demo") as PlanKey;
  const plan = PLANS[planKey] ?? PLANS.demo;
  const value = plan.features[feature];
  if (typeof value === "boolean") return value;
  return value > 0;
}

export function getFeatureLimit(
  subscription: SubscriptionLike,
  feature: keyof PlanFeatures
): number {
  const planKey = (subscription?.plan ?? "demo") as PlanKey;
  const plan = PLANS[planKey] ?? PLANS.demo;
  const value = plan.features[feature];
  if (typeof value === "boolean") return value ? Infinity : 0;
  return value;
}

export function getPlan(subscription: SubscriptionLike): Plan {
  const planKey = (subscription?.plan ?? "demo") as PlanKey;
  return PLANS[planKey] ?? PLANS.demo;
}
