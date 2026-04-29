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
  items: string[];
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
      "Grunnleggende hjemmeberedskap basert på DSBs anbefalinger. Fyll ut og heng opp på et synlig sted.",
    minPlan: "demo",
    items: [
      "Vann – minst 3 liter per person per dag (9 liter per person totalt)",
      "Mat som ikke krever kjøling eller koking (nok til 3 dager)",
      "Manuell bokseåpner",
      "Stearinlys og fyrstikker eller lighter",
      "Lommelykt med ekstra batterier",
      "Batteridrevet eller håndsveiv-radio",
      "Førstehjelpsskrin med bandasjer, plaster og smertestillende",
      "Nødvendig medisin for alle i husstanden (minst 3 dagers forbruk)",
      "Varme klær og soveposer/ulltepper",
      "Powerbank / eksternt batteri til mobiltelefon",
      "Kontanter i små sedler og mynter",
      "Kopier av viktige dokumenter (pass, forsikring, legemidler)",
      "Toalettartikler og hygieneprodukter (3 dager)",
      "Ekstra bleier og barnemat dersom relevant",
      "Jodtabletter (sjekk utløpsdato)",
    ],
  },
  {
    id: "mal-02a",
    name: "Beredskapslager",
    description:
      "Oversikt over hjemmelagrene dine. Fyll ut etter hvert som du handler inn.",
    minPlan: "basis",
    items: [
      "Vann på flaske (minst 9 liter per person)",
      "Hermetisk mat (bønner, tunfisk, tomater, supper)",
      "Tørrvarer (ris, pasta, havregryn, knekkebrød)",
      "Melkepulver eller holdbar melk (UHT)",
      "Energibarer og nøtter",
      "Salt, sukker og andre krydder",
      "Matolje",
      "Kaffepulver/te (komfort i krisesituasjon)",
      "Tørkede frukter og grønnsaker",
      "Babyfôr dersom relevant",
      "Husdjurfôr dersom relevant",
      "Parafin eller gass til alternativt kokeapparat",
      "Vedkasse eller alternativ varmekilde",
      "Ekstra gassbeholdere til gasskoker",
    ],
  },
  {
    id: "mal-03a",
    name: "Familieplan",
    description:
      "Kontakter, møtesteder og avtaler. Lagre et trykt eksemplar tilgjengelig for alle.",
    minPlan: "basis",
    items: [
      "Alle familiemedlemmers mobilnummer skrevet ned på papir",
      "Nødnummer notert: politi 112, brann 110, ambulanse 113",
      "Nærmeste slektning utenfor husstanden – navn og tlf notert",
      "Nabo du stoler på – navn og tlf notert",
      "Primært møtested definert (f.eks. hjemme eller hos besteforeldre)",
      "Sekundært møtested definert (utenfor nærområdet)",
      "Alle vet hvor møtestedene er",
      "Avtalt hvem som henter barna dersom skole/barnehage stenger",
      "Plan for kjæledyr ved evakuering",
      "Viktige dokumenter samlet på ett sted (pass, forsikring, legemidler)",
      "Alle familiemedlemmer har øvd på planen minst én gang",
    ],
  },
  {
    id: "mal-04a",
    name: "Evakueringsplan",
    description:
      "Forbered deg på å forlate hjemmet raskt og trygt. Test planen årlig.",
    minPlan: "basis",
    items: [
      "Beredskapsbag pakket og klar (\"go-bag\")",
      "Bag inneholder: vann, mat, medisiner, dokumenter, penger, klær",
      "Alle rømningsveier fra boligen kartlagt",
      "Alle vet hvordan de åpner vinduer og alternative utganger",
      "Møtested utenfor boligen avklart med alle husstandsmedlemmer",
      "Bil har minst halv tank bensinkontrollert jevnlig",
      "Kart over nærområdet tilgjengelig (ikke bare digitalt)",
      "Viktige medisiner og resepter samlet i en zip-lock-pose",
      "Kopier av pass og ID tatt og lagret sikkert",
      "Forsikringspolise og kontaktinfo tilgjengelig",
      "Nødpenger (kontanter) i beredskapsbagen",
      "Ladeledninger og powerbank i beredskapsbagen",
      "Plan kommunisert til alle familiemedlemmer",
      "Evakueringsplan øvd på det siste året",
    ],
  },
  {
    id: "mal-05a",
    name: "Beredskap ved strømbrudd",
    description:
      "Handlingsplan og forberedelsesguide. Strømbrudd er den vanligste krisesituasjonen i Norge.",
    minPlan: "basis",
    items: [
      "Lommelykt med fungerende batterier tilgjengelig",
      "Stearinlys og fyrstikker på lett tilgjengelig plass",
      "Alternativt kokeapparat (gassbrenner/primus) med tilstrekkelig gass",
      "Alternativ varmekilde (vedfyring, parafin, gass) klar til bruk",
      "Nok ved/brensel til minst 3 dager",
      "Soveposer eller ekstra tepper for å holde varmen",
      "Batteridrevet radio for nyheter og myndighetsinformasjon",
      "Powerbank ladet og klar for mobiltelefon",
      "Vann lagret (vanntrykk kan forsvinne ved langvarig strømbrudd)",
      "Kontanter tilgjengelig (kortterminal fungerer ikke uten strøm)",
      "Matlagring som ikke krever strøm planlagt",
      "Frysevarer: plan for hva som gjøres hvis fryseren tiner",
      "Medisinsk utstyr som krever strøm: backup-plan laget",
      "Naboer med spesielle behov sjekket",
    ],
  },
  {
    id: "mal-06a",
    name: "Beredskap ved ekstremvær",
    description:
      "Handlingsplan for storm, flom og snøskred. Tilpass til din region og boligsituasjon.",
    minPlan: "basis",
    items: [
      "Yr.no og Varsom.no bokmerket for varsler",
      "Varselapper installert på mobil (NVE, Yr)",
      "Hagemøbler og løse gjenstander sikret eller bragt inn",
      "Tak og takrenner kontrollert for svakheter",
      "Kjellervindu og kjellerdør tett mot vanninntrengning",
      "Sump-pumpe kontrollert og fungerende (ved flomutsatt kjeller)",
      "Bil parkert bort fra trær og utsatte steder ved storm",
      "Beredskapsforsyninger (mat, vann, lys, varme) kontrollert",
      "Flombarrierer eller sandsekker tilgjengelig ved behov",
      "Evakueringsplan kjent av alle husstandsmedlemmer",
      "Nabovarsel etablert (varsler hverandre ved fare)",
      "Forsikringspolise gjennomgått – vet hva som dekkes",
      "Viktige eiendeler løftet fra kjellergulvet",
      "Kontakt med kommunen om lokale risikoområder avklart",
    ],
  },
  {
    id: "mal-07a",
    name: "Beredskapsøvelse",
    description:
      "Familieøvelse — gjennomføring og evaluering. Sett av 2–3 timer og gjennomfør realistisk.",
    minPlan: "basis",
    items: [
      "Dato for øvelsen satt og kommunisert til alle",
      "Scenario valgt (f.eks. strømbrudd i 72 timer)",
      "Alle familiemedlemmer informert om hva øvelsen går ut på",
      "Beredskapsbag gjennomgått – mangler notert",
      "Møtesteder testet – alle finner frem uten GPS",
      "Alternativt kokeapparat testet i praksis",
      "Kommunikasjon uten internett øvd (hva gjør vi?)",
      "Nødnumre gått gjennom med barna",
      "Rømningsveier gått gjennom i boligen",
      "Første hjelp repetert (plaster, bandasje, HLR)",
      "Mangler og svakheter notert under øvelsen",
      "Tiltak for å utbedre mangler prioritert og fordelt",
      "Neste øvelse datofestet",
    ],
  },
];
