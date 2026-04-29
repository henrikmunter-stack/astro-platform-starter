# HjemTrygg – Beredskap gjort enkelt

En komplett SaaS-plattform for norsk hjemmeberedskap. Bygget med Next.js 14, Prisma, Stripe og OpenAI.

Driftet av Münter Rådgivning, org.nr. 933 219 569. Domene: [hjemtrygg.no](https://hjemtrygg.no)

---

## 1. Kom i gang – lokal kjøring

### Forutsetninger
- Node.js 18 eller nyere
- PostgreSQL-database (lokal, Supabase eller Neon)
- npm

### Steg for steg

```bash
# Klon repoet
git clone <repo-url> hjemtrygg
cd hjemtrygg

# Installer avhengigheter
npm install

# Sett opp miljøvariabler
cp .env.example .env.local
# Rediger .env.local og fyll inn DATABASE_URL og NEXTAUTH_SECRET som minimum

# Kjør databasemigrering
npx prisma migrate dev

# Fyll databasen med demo-data
npx prisma db seed

# Start utviklingsserver
npm run dev
```

Åpne http://localhost:3000 i nettleseren.

---

## 2. Supabase-oppsett

1. Gå til [supabase.com](https://supabase.com) og opprett et gratis prosjekt
2. Gå til **Settings > Database > Connection string (URI)**
3. Kopier URI-strengen og lim inn som `DATABASE_URL` i `.env.local`
4. Kjør: `npx prisma migrate deploy`
5. Kjør seed-data: `npx prisma db seed`

### Alternativ: Neon
1. Gå til [neon.tech](https://neon.tech) og opprett et gratis prosjekt
2. Kopier connection string fra dashboardet
3. Sett som `DATABASE_URL` i `.env.local`
4. Kjør: `npx prisma migrate deploy`

---

## 3. Resend-oppsett (e-post / magic link)

HjemTrygg bruker [Resend](https://resend.com) for å sende magic link-e-poster ved innlogging og kontaktskjema-meldinger.

1. Opprett konto på [resend.com](https://resend.com)
2. Gå til **API Keys** og opprett en ny nøkkel
3. Sett `RESEND_API_KEY` i `.env.local`
4. Gå til **Domains** og legg til `hjemtrygg.no` som avsenderdomene
5. Følg Resend sine instruksjoner for å verifisere domenet (DNS-oppføringer)
6. Bruk `noreply@hjemtrygg.no` som avsenderadresse (allerede konfigurert i `lib/email.ts`)

Uten `RESEND_API_KEY` logges magic link-URL til konsollen (kun i utvikling).

---

## 4. Stripe-oppsett

1. Opprett konto på [stripe.com](https://stripe.com)
2. Gå til **Products** og opprett tre produkter:
   - **HjemTrygg Basis** – 99 kr/mnd (recurring)
   - **HjemTrygg Pluss** – 199 kr/mnd (recurring)
   - **HjemTrygg Premium** – 349 kr/mnd (recurring)
3. Kopier **Price ID** fra hvert produkt til `.env.local`:
   ```
   STRIPE_PRICE_ID_BASIS=price_...
   STRIPE_PRICE_ID_PLUSS=price_...
   STRIPE_PRICE_ID_PREMIUM=price_...
   ```
4. Kopier **Secret Key** og **Publishable Key** fra **Developers > API Keys**:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

### Webhook-oppsett (produksjon)
1. Gå til **Developers > Webhooks** i Stripe Dashboard
2. Klikk **Add endpoint** og skriv inn: `https://hjemtrygg.no/api/stripe/webhook`
3. Velg disse hendelsene:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Klikk **Add endpoint** og kopier **Signing secret** til `STRIPE_WEBHOOK_SECRET`

### Webhook (lokal utvikling)
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Kopier webhook secret til STRIPE_WEBHOOK_SECRET i .env.local
```

---

## 5. OpenAI-oppsett (TryggBot)

1. Opprett konto på [platform.openai.com](https://platform.openai.com)
2. Gå til **API Keys** og opprett en ny nøkkel
3. Sett `OPENAI_API_KEY` i `.env.local`
4. Anbefalt modell: `gpt-4o-mini` (brukes automatisk – raskest og billigst)
5. Sett gjerne brukslimitter i OpenAI-dashboardet for å unngå uventede kostnader

Uten OpenAI-nøkkel kjører TryggBot i demo-modus med forhåndsdefinerte svar.

---

## 6. Deploy til Netlify

HjemTrygg er deployet på Netlify med `@netlify/plugin-nextjs`.

1. Push koden til GitHub
2. Gå til [app.netlify.com](https://app.netlify.com) og importer repoet
3. Legg til alle miljøvariabler fra `.env.example` i **Site Settings > Environment variables**
4. **Viktig:** Sett `NEXTAUTH_URL=https://hjemtrygg.no` (Netlify setter ikke denne automatisk)
5. Kontroller at `netlify.toml` finnes i rotmappen med `@netlify/plugin-nextjs`

### Domene: koble hjemtrygg.no til Netlify
1. Gå til **Site Settings > Domain management > Add custom domain**
2. Skriv inn `hjemtrygg.no` og følg instruksjonene
3. Oppdater DNS hos domeneregistraren til å peke til Netlify
4. Netlify provisjonerer automatisk SSL-sertifikat via Let's Encrypt

### Stripe webhook etter deploy
- Oppdater webhook-endepunkt i Stripe Dashboard til `https://hjemtrygg.no/api/stripe/webhook`

---

## Miljøvariabler – krav til produksjon

| Variabel | Påkrevd | Beskrivelse |
|----------|---------|-------------|
| `DATABASE_URL` | Ja | PostgreSQL connection string |
| `NEXTAUTH_URL` | Ja | Full URL til appen: https://hjemtrygg.no |
| `NEXTAUTH_SECRET` | Ja | Random string (openssl rand -base64 32) |
| `RESEND_API_KEY` | Ja | Resend API-nøkkel for e-postutsending |
| `STRIPE_SECRET_KEY` | Nei | Påkrevd for betalingsfunksjonalitet |
| `STRIPE_WEBHOOK_SECRET` | Nei | Påkrevd for Stripe webhooks |
| `OPENAI_API_KEY` | Nei | Påkrevd for TryggBot (AI-svar) |
| `ADMIN_EMAILS` | Nei | Kommaseparert liste over admin-e-poster |

---

## Teknologistack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL via Prisma ORM (Supabase/Neon)
- **Auth:** NextAuth.js v5 (magic link + Google OAuth)
- **E-post:** Resend
- **Betalinger:** Stripe Subscriptions
- **AI:** OpenAI gpt-4o-mini (TryggBot)
- **Styling:** Tailwind CSS + shadcn/ui-komponenter
- **Hosting:** Netlify med @netlify/plugin-nextjs

---

## Prosjektstruktur

```
hjemtrygg/
├── app/
│   ├── (marketing)/    # Offentlige sider (forside, priser, blogg, etc.)
│   ├── (app)/          # Innloggede app-sider (dashboard, sjekklister, etc.)
│   ├── api/            # API-ruter (auth, stripe, tryggbot, kontakt, etc.)
│   └── globals.css
├── components/
│   ├── ui/             # Grunnleggende UI-komponenter
│   ├── marketing/      # Markedsføringsseksjoner
│   ├── app/            # App-komponenter
│   └── shared/         # Delte komponenter (Navbar, Footer, Logo)
├── lib/                # Hjelpefunksjoner og klientbiblioteker
│   ├── auth.ts         # NextAuth-konfigurasjon med Resend
│   ├── email.ts        # Resend e-posthjelper
│   ├── feature-gates.ts # Plan-grenser og tilgangskontroll
│   ├── stripe.ts       # Stripe-klient og PLAN_PRICE_MAP
│   └── plans.ts        # Abonnementsplaner og funksjoner
├── prisma/             # Skjema og seed
├── middleware.ts       # Auth-middleware for /app og /admin
└── .env.example
```
