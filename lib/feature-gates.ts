type Plan = "demo" | "basis" | "pluss" | "premium";

export const PLAN_LIMITS = {
  demo: {
    checklists: 1,
    inventoryItems: 10,
    familyContacts: 3,
    documents: 0,
    tryggbotMessages: 10,
  },
  basis: {
    checklists: 10,
    inventoryItems: 200,
    familyContacts: 20,
    documents: 0,
    tryggbotMessages: 200,
  },
  pluss: {
    checklists: 50,
    inventoryItems: 1000,
    familyContacts: 50,
    documents: 25,
    tryggbotMessages: 1000,
  },
  premium: {
    checklists: 999999,
    inventoryItems: 999999,
    familyContacts: 999999,
    documents: 999999,
    tryggbotMessages: 999999,
  },
} as const;

export function getPlanFromPriceId(priceId: string): Plan {
  if (priceId === process.env.STRIPE_PRICE_ID_BASIS) return "basis";
  if (priceId === process.env.STRIPE_PRICE_ID_PLUSS) return "pluss";
  if (priceId === process.env.STRIPE_PRICE_ID_PREMIUM) return "premium";
  return "demo";
}

export function canAdd(
  plan: Plan,
  resource: keyof (typeof PLAN_LIMITS)[Plan],
  currentCount: number
): boolean {
  return currentCount < PLAN_LIMITS[plan][resource];
}
